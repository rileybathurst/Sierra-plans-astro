import React from "react";
import { jsPDF } from "jspdf";
import { Canvg } from "canvg";
// import type { PlanTypes } from "../types/plan-types";

const PDFBuild = ({ plan, dataURL }) => {
  const doc = new jsPDF("p", "in", "letter", true);

  doc.setFont("helvetica", "normal");

  doc.setLineWidth(0.01);

  doc.text(plan.name, 0.5, 0.75);

  doc.setFontSize(12);

  /* // TODO:
  doc.text(
    `${plan.address}, ${areas[0]?.name}, ${
      areas[0]?.state === "california" ? "CA" : "NV"
    }${plan.zip ? `. ${plan.zip}` : ""}`,
    0.5,
    1
  ); */

  doc.setFontSize(9);

  if (plan.jobber) {
    doc.rect(6.75, 0.5, 1.25, 1.25);
    doc.text("Jobber", 6.85, 0.75);
    doc.text(plan.jobber.toString(), 6.85, 1);

    if (plan.jobbertakedown) {
      doc.text("Jobber Takedown", 6.85, 1.25);
      doc.text(plan.jobbertakedown.toString(), 6.85, 1.5);
    }
  }

  if (plan.timerHours) {
    doc.text(`Timer: ${plan.timerHours} Hours`, 0.5, 1.25);
  }

  if (plan.timerFallback) {
    doc.text(`Timer: ${plan.timerFallback}`, 0.5, 1.25);
  }

  /* // TODO:
if (plan.notes.data.notes) {
    const splitNote = doc.splitTextToSize(plan.notes.data.notes, 7);
    doc.text(splitNote, 0.5, 1.5, { maxWidth: 6 });
  } */

  // ? maybe you do need to do this through canvas.tsx and use the adjusted svg code
  /* if (plan.svg) {
    // base64 encode the canvas image
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
    const canvas = document.createElement("canvas");
    canvas.width = 2550;
    canvas.height = 2550;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const v = Canvg.fromString(ctx, plan.svg);

      v.start();
      const dataURL = canvas.toDataURL() || "";

      doc.addImage(dataURL, "png", 0.5, 2, 7.5, 8);
    }
  } */

  // this uses a browser API that can't come through
  doc.addSvgAsImage(plan.svg, 0.5, 2, 7.5, 8, "", false, 0);

  let mostRecent = "";
  if (plan.createdAt !== plan.updatedAt) {
    const dates = `Created: ${plan.createdAt} Updated: ${plan.updatedAt}`;
    doc.text(dates, 0.5, 9.5);
    mostRecent = plan.updatedAt;
  } else {
    doc.text(`Created: ${plan.updatedAt}`, 0.5, 9.5);
    mostRecent = plan.createdAt;
  }

  doc.line(0.5, 9.6, 8, 9.6);

  // const logo = new Image();
  /*   logo.src =
    "https://sierralighting.s3.us-west-1.amazonaws.com/sierra_lighting-full_logo-black-fs8.png";
  doc.addImage(logo, "png", 0.5, 9.7, 1, 0.51); */

  doc.save(
    `${plan.jobber}${plan.jobbertakedown ? `-${plan.jobbertakedown}` : ""}-${
      plan.name
    }-${plan.slug}-${plan.mostRecent}`
  );
  // turn off for developing
};
