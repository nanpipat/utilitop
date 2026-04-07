export const exportSVG = (svgString: string, filename = "diagram.svg") => {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportPNG = async (svgString: string, filename = "diagram.png") => {
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.src = url;
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.width * 2;
  canvas.height = img.height * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, img.width, img.height);
  ctx.drawImage(img, 0, 0);

  canvas.toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob!);
    a.download = filename;
    a.click();
  }, "image/png");

  URL.revokeObjectURL(url);
};
