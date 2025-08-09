using HellDivers2DemocracyHub.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add HTTP client for Helldivers 2 API
builder.Services.AddHttpClient<IHellDivers2Service, HellDivers2Service>();

// Add health checks
builder.Services.AddHealthChecks();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
        else
        {
            // In production, configure specific allowed origins
            var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
            if (allowedOrigins.Length > 0)
            {
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            }
            else
            {
                // Default to same origin
                policy.AllowAnyMethod()
                      .AllowAnyHeader()
                      .SetIsOriginAllowed(origin => new Uri(origin).Host == builder.Configuration["WEBSITE_HOSTNAME"]);
            }
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Add security headers for production
if (app.Environment.IsProduction())
{
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Append("X-Frame-Options", "DENY");
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
        context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
        await next();
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Enable CORS
app.UseCors();

// Add health check endpoint
app.MapHealthChecks("/health");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
