require("dotenv").config();

var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

var configCentral = {
  user: process.env.FTP_USER,
  // Password optional, prompted if none given
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  localRoot: __dirname + "/out",
  remoteRoot: `${process.env.CENTRAL_SITE_REMOTE_PATH}`,
  include: ["*", "**/*"], // this would upload everything except dot files
  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  exclude: [],
  // delete ALL existing files at destination before uploading, if true
  deleteRemote: false,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: true,
  // use sftp or ftp
  sftp: false,
};

var configSite1 = {
  user: process.env.FTP_USER,
  // Password optional, prompted if none given
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  localRoot: __dirname + "/out",
  remoteRoot: `${process.env.SITE1_REMOTE_PATH}`,
  include: ["*", "**/*"], // this would upload everything except dot files

  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  exclude: [],
  // delete ALL existing files at destination before uploading, if true
  deleteRemote: false,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: true,
  // use sftp or ftp
  sftp: false,
};

var configSite2 = {
  user: process.env.FTP_USER,
  // Password optional, prompted if none given
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT,
  localRoot: __dirname + "/out",
  remoteRoot: `${process.env.SITE2_REMOTE_PATH}`,
  include: ["*", "**/*"], // this would upload everything except dot files
  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  exclude: [],
  // delete ALL existing files at destination before uploading, if true
  deleteRemote: false,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: true,
  // use sftp or ftp
  sftp: false,
};

ftpDeploy
  .deploy(configCentral)
  .then((res) => {
    console.log("finished central:", res);

    ftpDeploy
      .deploy(configSite1)
      .then((res) => {
        console.log("finished site 1:", res);

        ftpDeploy
          .deploy(configSite2)
          .then((res) => console.log("finished site 2:", res))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
