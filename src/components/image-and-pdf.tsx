import React, { useEffect } from "react";
import { Canvg } from 'canvg';
import { jsPDF } from "jspdf";
import type { PlanTypes } from "../interfaces/plan-types";

export default function ImageAndPDF({ plan, createdAtDate, updatedAtDate }: { plan: PlanTypes; createdAtDate: string; updatedAtDate: string; }) {

  useEffect(() => {
    const generatePdf = async () => {
      const doc = new jsPDF("p", "in", "letter", true);

      doc.setFont("helvetica", "normal");

      doc.setLineWidth(0.01);

      doc.text(plan.name, 0.5, 0.75);

      doc.setFontSize(12);

      doc.text(
        `${plan.address}, ${plan.areas?.[0]?.name}, ${plan.areas?.[0]?.state === "california" ? "CA" : "NV"
        }${plan.zip ? `. ${plan.zip}` : ""}`,
        0.5,
        1
      );

      // doc.setFontSize(9);

      if (plan.jobber) {
        doc.rect(6.75, 0.525, 1.25, 0.35);
        doc.text("Jobber", 6.85, 0.75);
        doc.text(plan.jobber.toString(), 7.5, 0.75);
      }

      doc.setFontSize(9);

      if (plan.timerHours) {
        doc.text(`Timer: ${plan.timerHours} Hours`, 0.5, 1.25);
      }

      if (plan.timerFallback) {
        doc.text(`Timer: ${plan.timerFallback}`, 0.5, 1.25);
      }

      if (plan.notes) {
        const splitNote = doc.splitTextToSize(plan.notes, 7);
        doc.text(splitNote, 0.5, 1.5, { maxWidth: 6 });
      }
      if (plan.basicNotes) {
        const splitBasicNote = doc.splitTextToSize(plan.basicNotes, 7);
        doc.text(splitBasicNote, 0.5, 1.5);
      }

      if (plan.svg) {
        const canvas = document.createElement('canvas');
        canvas.width = 2550;
        canvas.height = 2550;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const v = Canvg.fromString(ctx, plan.svg);
          await v.render();
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 0.5, 2, 7.5, 8); // adjust position/size as needed
        } else {
          console.error('Could not get 2D context from canvas.');
        }
      }

      let mostRecent = "";
      if (createdAtDate !== updatedAtDate) {
        const dates = `Created: ${createdAtDate} Updated: ${updatedAtDate}`;
        doc.text(dates, 0.5, 9.5);
        mostRecent = updatedAtDate;
      } else {
        doc.text(`Created: ${updatedAtDate}`, 0.5, 9.5);
        mostRecent = createdAtDate;
      }

      doc.line(0.5, 9.6, 8, 9.6);

      const logo = new Image();
      logo.src =
        "https://sierralighting.s3.us-west-1.amazonaws.com/sierra_lighting-full_logo-black-fs8.png";
      doc.addImage(logo, "png", 0.5, 9.7, 1, 0.51);

      doc.save(
        `${plan.jobber}-${plan.name}-${plan.slug}-${mostRecent}`
      ); // * turn off for developing
    };

    generatePdf();
  }, [plan, createdAtDate, updatedAtDate]);

  return (
    <>
      {plan.svg && (
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(plan.svg)}`}
          alt="Plan SVG"
        />
      )}
    </>
  );
}