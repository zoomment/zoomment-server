type Props = {
  introduction: string;
  buttonText: string;
  buttonUrl: string;
  epilogue: string;
};

export const generateTemplate = (props: Props) => {
  const footer = `${process.env.BRAND_NAME} | ${process.env.ADMIN_EMAIL_ADDR}`;

  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Simple Transactional Email</title>
      <style media="all" type="text/css">
      /* -------------------------------------
      GLOBAL RESETS
  ------------------------------------- */
      
      body {
        font-family: Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.3;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      
      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
      }
      
      table td {
        font-family: Helvetica, sans-serif;
        font-size: 14px;
        vertical-align: top;
      }
      /* -------------------------------------
      BODY & CONTAINER
  ------------------------------------- */
      html,
      body {
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
      }
      
      .body {
        background-color: #f5f5f5;
        width: 100%;
      }
      
      .container {
        margin: 0 auto !important;
        max-width: 400px;
        padding: 0;
        padding-top: 24px;
        width: 400px;
      }
      
      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 400px;
        padding: 0;
      }
      /* -------------------------------------
      HEADER, FOOTER, MAIN
  ------------------------------------- */
      
      .main {
        background: #ffffff;
        border: 1px solid #eaebed;
        border-radius: 14px;
        width: 100%;
      }
      
      .wrapper {
        box-sizing: border-box;
        padding: 24px 35px;
      }
      
      .footer {
        clear: both;
        padding-top: 24px;
        padding-bottom: 24px;
        text-align: center;
        width: 100%;
      }
      
      .footer td,
      .footer p,
      .footer span,
      .footer a {
        color: #9a9ea6;
        font-size: 14px;
        text-align: center;
      }
      /* -------------------------------------
      TYPOGRAPHY
  ------------------------------------- */
      
      h2 {
        font-family: Helvetica, sans-serif;
        font-size: 18px;
        font-weight: 700;
        margin: 0;
        margin-top: 12px;
        margin-bottom: 16px;
      }

      p {
        font-family: Helvetica, sans-serif;
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 16px;
      }
      
      a {
        color: #0867ec;
        text-decoration: underline;
      }
      /* -------------------------------------
      BUTTONS
  ------------------------------------- */
      
      .btn {
        box-sizing: border-box;
        min-width: 100% !important;
        width: 100%;
      }
      
      .btn > tbody > tr > td {
        padding-bottom: 16px;
      }
      
      .btn table {
        width: auto;
      }
      
      .btn table td {
        background-color: #ffffff;
        border-radius: 4px;
        text-align: center;
      }
      
      .btn a {
        background-color: #ffffff;
        border: solid 2px #0867ec;
        border-radius: 8px;
        box-sizing: border-box;
        color: #0867ec;
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        padding: 10px 20px;
        text-decoration: none;
        text-transform: capitalize;
      }
      
      .btn-primary table td {
        background-color: #1677ff;
      }
      
      .btn-primary a {
        background-color: #1677ff;
        border-color: #1677ff;
        color: #ffffff;
      }
      
      @media all {
        .btn-primary table td:hover {
          background-color: #4096ff !important;
        }
        .btn-primary a:hover {
          background-color: #4096ff !important;
          border-color: #4096ff !important;
        }
      }
      
      /* -------------------------------------
      OTHER STYLES THAT MIGHT BE USEFUL
  ------------------------------------- */
      
      .last {
        margin-bottom: 0;
      }
      
      .first {
        margin-top: 0;
      }
      
      .align-center {
        text-align: center;
      }
      
      .align-right {
        text-align: right;
      }
      
      .align-left {
        text-align: left;
      }
      
      .text-link {
        color: #0867ec !important;
        text-decoration: underline !important;
      }
      
      .clear {
        clear: both;
      }
      
      .mt0 {
        margin-top: 0;
      }
      
      .mb0 {
        margin-bottom: 0;
      }
      
      /* -------------------------------------
      RESPONSIVE AND MOBILE FRIENDLY STYLES
  ------------------------------------- */
      
      @media only screen and (max-width: 640px) {
        .main p,
        .main td,
        .main span {
          font-size: 14px !important;
        }
        .wrapper {
          padding: 8px !important;
        }
        .content {
          padding: 0 !important;
        }
        .container {
          padding: 0 !important;
          padding-top: 8px !important;
          width: 100% !important;
        }
        .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
        .btn table {
          max-width: 100% !important;
          width: 100% !important;
        }
        .btn a {
          font-size: 16px !important;
          max-width: 100% !important;
          width: 100% !important;
        }
      }
      /* -------------------------------------
      PRESERVE THESE STYLES IN THE HEAD
  ------------------------------------- */
      
      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
      }
      </style>
    </head>
    <body>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
          <td>&nbsp;</td>
          <td class="container">
            <div class="content">
  
              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">
  
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper">
                    <div style="text-align: center;">
                      <img width="50" height="auto" src="${process.env.DASHBOARD_URL}/email-logo.png" alt="${process.env.BRAND_NAME}" />
                      <br/>
                      <h2>${process.env.BRAND_NAME}</h2>
                      <br/>
                    </div>
                    <p>${props.introduction}</p>
                    ${
                      props.buttonUrl &&
                      `
                      <br/>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                        <tbody>
                          <tr>
                            <td align="center">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                  <tr>
                                    <td>
                                      <a href="${props.buttonUrl}" target="_blank">${props.buttonText}</a> 
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <br/>
                      `
                    }
                    <p>${props.epilogue}</p>
                  </td>
                </tr>
  
                <!-- END MAIN CONTENT AREA -->
                </table>
  
              <!-- START FOOTER -->
              <div class="footer">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-block">
                      <span class="apple-link">${footer}</span>
                    </td>
                  </tr>
                </table>
              </div>
  
              <!-- END FOOTER -->
              
  <!-- END CENTERED WHITE CONTAINER --></div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>
  
  
  `;
};
