//Functions Convert HEX to Bits
function hexToBits(hex) {
  var out = "";
  for (var c of hex) {
    switch (c) {
      case "0":
        out += "0000";
        break;
      case "1":
        out += "0001";
        break;
      case "2":
        out += "0010";
        break;
      case "3":
        out += "0011";
        break;
      case "4":
        out += "0100";
        break;
      case "5":
        out += "0101";
        break;
      case "6":
        out += "0110";
        break;
      case "7":
        out += "0111";
        break;
      case "8":
        out += "1000";
        break;
      case "9":
        out += "1001";
        break;
      case "a":
        out += "1010";
        break;
      case "b":
        out += "1011";
        break;
      case "c":
        out += "1100";
        break;
      case "d":
        out += "1101";
        break;
      case "e":
        out += "1110";
        break;
      case "f":
        out += "1111";
        break;
      default:
        return "";
    }
  }
  return out;
}

//Convert Bits to Signed INT
function bitsToSigned(bits) {
  var value = parseInt(bits, 2);
  var limit = 1 << (bits.length - 1);

  if (value >= limit) {
    // Value is negative; calculate two's complement.
    value = value - limit - limit;
  }
  return value;
}

function bitsToUnsigned(bits) {
  return parseInt(bits, 2);
}

function toLittleEndianSigned(hex) {
  // Creating little endian hex DCBA
  var hexArray = [];
  while (hex.length >= 2) {
    hexArray.push(hex.substring(0, 2));
    hex = hex.substring(2, hex.length);
  }
  // seems to already be reversed so not needed
  //hexArray.reverse();
  hex = hexArray.join("");

  // Hex to Bits
  var hex2bits = hexToBits(hex);

  // To signed int
  var signedInt = bitsToSigned(hex2bits);

  return signedInt;
}

// Add leading zero if toString(16) removed it
function toPaddedHexString(number) {
  hex = number.toString(16).toLowerCase();
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }
  return hex;
}

function decodeUplink(input) {
  var data = {};

  data.protocolVersion = (input.bytes[0] << 8);
  data.commandId = (input.bytes[1] << 8);

  var longitudeInteger =
    input.bytes[2] + (input.bytes[3] << 8) + (input.bytes[4] << 16);
  data.longitude =
    ((toLittleEndianSigned(toPaddedHexString(longitudeInteger)) * 215) / 10) *
    0.000001;

  var latitudeInteger =
    input.bytes[5] + (input.bytes[6] << 8) + (input.bytes[7] << 16);
  data.latitude =
    ((toLittleEndianSigned(toPaddedHexString(latitudeInteger)) * 108) / 10) *
    0.000001;
    
  
  var gps = Math.round(
    bitsToUnsigned(hexToBits(toPaddedHexString(input.bytes[8] << 8))) / 256 / 32
  );
  // TODO: use switch
  if (gps === 0) {
    data.gpsFixStatus = "no fix";
  } else if (gps == 1) {
    data.gpsFixStatus = "2D";
  } else if (gps == 2) {
    data.gpsFixStatus = "3D";
  } else {
    data.gpsFixStatus ='n/a'
  }

  data.batteryCapacity =
    bitsToUnsigned(hexToBits(toPaddedHexString(input.bytes[9] << 8))) / 256;

  var warnings = [];
  if (data.battery < 30) {
      warnings.push("low battery");
  }

  return {
    data: data,
    warnings: warnings,
  };
}
