import React, { useRef, useEffect, useState } from "react";
import { Canvg } from 'canvg';
// import { PDFBuild } from './pdfBuild';
import { jsPDF } from "jspdf";

type PlanAttributes = {
  name: string;
  address: string;
  zip: string;
  jobber: number;
  jobbertakedown: number;
  timerHours: number;
  timerFallback: string;
  svg: string;
  areas: {
    data: {
      name: string;
      state: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
  slug: string;
  mostRecent: string;
};


export default function Canvas({ planAttributes }: PlanAttributes) {

  const [dataState, setDataState] = useState(' ');
  // console.log(dataState); // nope

  // do not name this it breaks the build
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    // grab the canvas and edit it with the useeffect to only do it once its drawn
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    // const v = Canvg.fromString(ctx, svgTest);
    const v = Canvg.fromString(ctx, planAttributes.svg);
    v.start();

    // base64 encode the canvas image
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
    const dataURL = canvas.current?.toDataURL() || '';

    setDataState(dataURL);

    const doc = new jsPDF("p", "in", "letter", true);

    doc.setFont("helvetica", "normal");

    doc.setLineWidth(0.01);

    doc.text(planAttributes.name, 0.5, 0.75);

    doc.setFontSize(12);

    doc.text(
      `${planAttributes.address}, ${planAttributes.areas.data[0]?.name}, ${planAttributes.areas.data[0]?.state === "california" ? "CA" : "NV"
      }${planAttributes.zip ? `. ${planAttributes.zip}` : ""}`,
      0.5,
      1
    );

    doc.setFontSize(9);

    if (planAttributes.jobber) {
      doc.rect(6.75, 0.5, 1.25, 1.25);
      doc.text("Jobber", 6.85, 0.75);
      doc.text(planAttributes.jobber.toString(), 6.85, 1);

      if (planAttributes.jobbertakedown) {
        doc.text("Jobber Takedown", 6.85, 1.25);
        doc.text(planAttributes.jobbertakedown.toString(), 6.85, 1.5);
      }
    }

    if (planAttributes.timerHours) {
      doc.text(`Timer: ${planAttributes.timerHours} Hours`, 0.5, 1.25);
    }

    if (planAttributes.timerFallback) {
      doc.text(`Timer: ${planAttributes.timerFallback}`, 0.5, 1.25);
    }

    doc.addImage(dataURL, "png", 0.5, 2, 7.5, 8);

    let mostRecent = "";
    if (planAttributes.createdAt !== planAttributes.updatedAt) {
      const dates = `Created: ${planAttributes.createdAt} Updated: ${planAttributes.updatedAt}`;
      doc.text(dates, 0.5, 9.5);
      mostRecent = planAttributes.updatedAt;
    } else {
      doc.text(`Created: ${planAttributes.updatedAt}`, 0.5, 9.5);
      mostRecent = planAttributes.createdAt;
    }

    doc.line(0.5, 9.6, 8, 9.6);

    const logo = new Image();
    logo.src =
      "https://sierralighting.s3.us-west-1.amazonaws.com/sierra_lighting-full_logo-black-fs8.png";
    doc.addImage(logo, "png", 0.5, 9.7, 1, 0.51);

    doc.save(
      `${planAttributes.jobber}${planAttributes.jobbertakedown ? `-${planAttributes.jobbertakedown}` : ""}-${planAttributes.name
      }-${planAttributes.slug}-${planAttributes.mostRecent}`
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