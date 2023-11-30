function decodeUplink(input) {

  var bytes = input.bytes;

  var gpsFixStatus = Math.floor(bytes[1] / 64);
  var reportType = bytes[1] % 64;
  var batteryCapacity = bytes[2];

  var d = (bytes[3] << 24) | (bytes[4] << 16) | (bytes[5] << 8) | bytes[6];
  var e = (bytes[7] << 24) | (bytes[8] << 16) | (bytes[9] << 8) | bytes[10];

  var latitude = parseInt(d) * 0.000001;
  var longitude = parseInt(e) * 0.000001;

  var decoded = {};
  decoded.batteryCapacity = batteryCapacity;
  decoded.longitude = longitude;
  decoded.latitude = latitude;

  switch (gpsFixStatus) {
    case 0:
      decoded.gpsFixStatus = "no fix";
      break;
    case 1:
      decoded.gpsFixStatus = "2D";
      break;
    case 2:
      decoded.gpsFixStatus = "3D";
      break;
    default:
      decoded.gpsFixStatus = "n/a";
  }

  switch (reportType) {
    case 2:
      decoded.reportType = "period mode report";
      break;
    case 4:
      decoded.reportType = "motion mode static report";
      break;
    case 5:
      decoded.reportType = "motion mode moving report";
      break;
    case 6:
      decoded.reportType = "motion mode static to moving report";
      break;
    case 7:
      decoded.reportType = "motion mode moving to static report";
      break;
    case 14:
      decoded.reportType = "sos";
      break;
    case 15:
      decoded.reportType = "low battery alarm report";
      break;
    case 17:
      decoded.reportType = "power on (temperature)";
      break;
    case 19:
      decoded.reportType = "power off (low battery)";
      break;
    case 20:
      decoded.reportType = "power off (temperature)";
      break;
    case 24:
      decoded.reportType = "fall advisory report";
      break;
    case 27:
      decoded.reportType = "fpending report";
      break;
    default:
      decoded.reportType = "n/a";
  }

  var warnings = [];
  if (decoded.batteryCapacity < 10) {
      warnings.push("low battery");
  }

  return {
    data: decoded,
    warnings: warnings
  };
}
