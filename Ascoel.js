function Decode(fPort, bytes, variables) {
  var decoded = {};

  function dec2bin(dec) {
    var bits = (dec >>> 0).toString(2);
    return Array(9 - bits.length).join("0") + bits;
  }

  if (fPort === 2) {
    decoded.reportType = "last sequence downlink";
  } else if (fPort === 5) {
    decoded.reportType = "presentation";
  } else if (fPort === 6) {
    decoded.reportType = "serial number";
  } else if (fPort === 7) {
    decoded.reportType = "release";
  } else if (fPort === 8) {
    decoded.reportType = "battery";
    decoded.batteryLevel = bytes[0];
  } else if (fPort === 9) {
    decoded.reportType = "alive";
    decoded.batteryLevel = bytes[0];
  } else if (fPort === 40) {
    decoded.reportType = "sos";
    var bits = dec2bin(bytes[0]);
    decoded.buttonPushed = bits.charAt(bits.length - 1) === "1";
  } else {
    decoded.reportType = "n/a";
  }

  console.log(decoded);
}
