function Decode(fPort, bytes, variables) {
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
      decoded.gpsFixStatus = "not fix";
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
      decoded.reportType = "Period mode report";
      break;
    case 4:
      decoded.reportType = "Motion mode static report";
      break;
    case 5:
      decoded.reportType = "Motion mode moving report";
      break;
    case 6:
      decoded.reportType = "Motion mode static to moving report";
      break;
    case 7:
      decoded.reportType = "Motion mode moving to static report";
      break;
    case 14:
      decoded.reportType = "Help report";
      break;
    case 15:
      decoded.reportType = "Low battery alarm report";
      break;
    case 17:
      decoded.reportType = "Power on (temperature)";
      break;
    case 19:
      decoded.reportType = "Power off (low battery)";
      break;
    case 20:
      decoded.reportType = "Power off (temperature)";
      break;
    case 24:
      decoded.reportType = "Fall advisory report";
      break;
    case 27:
      decoded.reportType = "Fpending report";
      break;
    default:
      decoded.reportType = "n/a";
  }

  console.log("decoded payload: " + JSON.stringify(decoded, null, "\t"));
  return decoded;
}
