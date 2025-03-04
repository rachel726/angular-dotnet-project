using Microsoft.AspNetCore.RateLimiting;
using NumberValidation.Models;
using NumberValidation.Services;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

builder.Services.AddMemoryCache();
builder.Services.AddSingleton<INumberValidationService, NumberValidationService>();

builder.Services.AddRateLimiter(options =>
{
    options.AddTokenBucketLimiter("ApiLimit", config =>
    {
        config.TokenLimit = 10;
        config.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        config.QueueLimit = 0;
        config.ReplenishmentPeriod = TimeSpan.FromSeconds(60);
        config.TokensPerPeriod = 10;
        config.AutoReplenishment = true;
    });

    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;

        DateTime retryTime = DateTime.UtcNow.AddMinutes(1);

        await context.HttpContext.Response.WriteAsJsonAsync(new NumberResponse
        {
            IsRateLimited = true,
            NextAvailableTime = retryTime,
            Message = $"Rate limit exceeded. Try again after {retryTime:yyyy-MM-dd HH:mm:ss}."
        }, cancellationToken);
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200")
        .AllowAnyMethod()
        .AllowAnyHeader());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAngular");
app.UseRateLimiter();
app.UseAuthorization();
app.MapControllers();

app.Run();