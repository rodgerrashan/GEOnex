const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas"); // npm install canvas


const utm = require("utm");

// TXT Export with Easting/Northing from Latitude/Longitude
const exportToTxt = (points, filename) => {
  if (!points || points.length === 0) {
    throw new Error("No points to export");
  }

  const header = "PointID, Easting, Northing, Zone, Description\n";

  const rows = points.map((p, i) => {
    const pointId = i + 1;
    const description = p.Name || p.Type || "";

    // Convert to UTM
    let easting = "", northing = "", zone = "";
    if (p.Latitude != null && p.Longitude != null) {
      const utmCoord = utm.fromLatLon(p.Latitude, p.Longitude);
      easting = utmCoord.easting.toFixed(3);
      northing = utmCoord.northing.toFixed(3);
      zone = `${utmCoord.zoneNum}${utmCoord.zoneLetter}`;
    }

    return `${pointId}, ${easting}, ${northing}, ${zone}, ${description}`;
  }).join("\n");

  const content = header + rows;
  const filePath = path.join(__dirname, "../exports", filename);
  fs.writeFileSync(filePath, content);

  return filePath;
};

module.exports = { exportToTxt };


// PNG Export (basic visualization)
const exportToPng = (points, filename) => {
  const canvas = createCanvas(600, 600);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 600, 600);
  ctx.fillStyle = "#000";

  points.forEach(p => {
    const x = p.x * 10 + 300;
    const y = 600 - (p.y * 10 + 300);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText(p.name, x + 5, y - 5);
  });

  const filePath = path.join(__dirname, "../exports", filename);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

// DWG (Placeholder: Simulate AutoCAD DXF format)
const exportToDxf = (points, filename) => {
  const dxf = [
    "0",
    "SECTION",
    "2",
    "ENTITIES",
    ...points.flatMap(p => [
      "0",
      "POINT",
      "8",
      "0",
      "10",
      p.x,
      "20",
      p.y,
      "30",
      p.z
    ]),
    "0",
    "ENDSEC",
    "0",
    "EOF"
  ].join("\n");

  const filePath = path.join(__dirname, "../exports", filename);
  fs.writeFileSync(filePath, dxf);
  return filePath;
};

module.exports = { exportToTxt, exportToPng, exportToDxf };
