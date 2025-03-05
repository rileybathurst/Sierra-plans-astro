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

    doc.text(svgProp.name, 0.5, 0.75);

    doc.setFontSize(12);

    doc.text(
      `${svgProp.address}, ${svgProp.areas.data[0]?.name}, ${svgProp.areas.data[0]?.state === "california" ? "CA" : "NV"
      }${svgProp.zip ? `. ${svgProp.zip}` : ""}`,
      0.5,
      1
    );

    doc.setFontSize(9);

    if (svgProp.jobber) {
      doc.rect(6.75, 0.5, 1.25, 1.25);
      doc.text("Jobber", 6.85, 0.75);
      doc.text(svgProp.jobber.toString(), 6.85, 1);

      if (svgProp.jobbertakedown) {
        doc.text("Jobber Takedown", 6.85, 1.25);
        doc.text(svgProp.jobbertakedown.toString(), 6.85, 1.5);
      }
    }

    if (svgProp.timerHours) {
      doc.text(`Timer: ${svgProp.timerHours} Hours`, 0.5, 1.25);
    }

    if (svgProp.timerFallback) {
      doc.text(`Timer: ${svgProp.timerFallback}`, 0.5, 1.25);
    }

    doc.addImage(dataURL, "png", 0.5, 2, 7.5, 8);

    let mostRecent = "";
    if (svgProp.createdAt !== svgProp.updatedAt) {
      const dates = `Created: ${svgProp.createdAt} Updated: ${svgProp.updatedAt}`;
      doc.text(dates, 0.5, 9.5);
      mostRecent = svgProp.updatedAt;
    } else {
      doc.text(`Created: ${svgProp.updatedAt}`, 0.5, 9.5);
      mostRecent = svgProp.createdAt;
    }

    doc.line(0.5, 9.6, 8, 9.6);

    const logo = new Image();
    logo.src =
      "https://sierralighting.s3.us-west-1.amazonaws.com/sierra_lighting-full_logo-black-fs8.png";
    doc.addImage(logo, "png", 0.5, 9.7, 1, 0.51);

    doc.save(
      `${svgProp.jobber}${svgProp.jobbertakedown ? `-${svgProp.jobbertakedown}` : ""}-${svgProp.name
      }-${svgProp.slug}-${svgProp.mostRecent}`
    );
    // turn off for developing

  });

  return (
    <>
      <canvas ref={canvas} width="2550" height="2550" />
      <img src={dataState} alt="the svg as an img" className="measure" />

    </>
  );
}