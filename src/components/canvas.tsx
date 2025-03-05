import React, { useRef, useEffect, useState } from "react";
import { Canvg } from 'canvg';
// import { PDFBuild } from './pdfBuild';
import { jsPDF } from "jspdf";

export default function Canvas({ svgProp }: string) {

  const [dataState, setDataState] = useState(' ');
  // console.log(dataState); // nope

  // do not name this it breaks the build
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    // grab the canvas and edit it with the useeffect to only do it once its drawn
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    // const v = Canvg.fromString(ctx, svgTest);
    const v = Canvg.fromString(ctx, svgProp.svg);
    v.start();

    // base64 encode the canvas image
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
    const dataURL = canvas.current?.toDataURL() || '';

    setDataState(dataURL);

    const doc = new jsPDF("p", "in", "letter", true);

    doc.setFont("helvetica", "normal");

    doc.setLineWidth(0.01);

    // this works but could probably be cleaner
    doc.text('name', 0.5, 0.75);
    doc.addImage(dataURL, "png", 0.5, 2, 7.5, 8);
    doc.save('test.pdf');

  });

  return (
    <>
      <canvas ref={canvas} width="2550" height="2550" />
      <img src={dataState} alt="the svg as an img" className="measure" />

    </>
  );
}