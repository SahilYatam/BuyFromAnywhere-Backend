export const emailTemplate = (alertData) => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .error-box { background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; margin: 15px 0; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
              .info-item { background-color: #f8f9fa; padding: 10px; border-radius: 4px; }
              .stack-trace { background-color: #f1f3f4; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
              .footer { background-color: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>🚨 Critical Error Alert</h1>
                  <p>${alertData.appName} - ${alertData.environment}</p>
              </div>
              <div class="content">
                  <div class="error-box">
                      <h3>${alertData.errorName}</h3>
                      <p><strong>Message:</strong> ${alertData.errorMessage}</p>
                  </div>
                  
                  <div class="info-grid">
                      <div class="info-item">
                          <strong>Environment:</strong><br>${
                            alertData.environment
                          }
                      </div>
                      <div class="info-item">
                          <strong>Service:</strong><br>${alertData.service}
                      </div>
                      <div class="info-item">
                          <strong>Server:</strong><br>${
                            alertData.serverInfo.hostname
                          }
                      </div>
                      <div class="info-item">
                          <strong>Timestamp:</strong><br>${alertData.timestamp}
                      </div>
                  </div>

                  <h4>Stack Trace:</h4>
                  <div class="stack-trace">${alertData.errorStack}</div>

                  <h4>Server Information:</h4>
                  <ul>
                      <li><strong>Platform:</strong> ${
                        alertData.serverInfo.platform
                      }</li>
                      <li><strong>Node Version:</strong> ${
                        alertData.serverInfo.nodeVersion
                      }</li>
                      <li><strong>Memory Usage:</strong> ${Math.round(
                        alertData.serverInfo.memory.heapUsed / 1024 / 1024
                      )}MB</li>
                      <li><strong>Uptime:</strong> ${Math.round(
                        alertData.serverInfo.uptime / 60
                      )} minutes</li>
                  </ul>
              </div>
              <div class="footer">
                  <p>This alert was generated automatically by the Node.js Alerting System</p>
                  <p>Please investigate and resolve this issue as soon as possible</p>
              </div>
          </div>
      </body>
      </html>
    `;
};
