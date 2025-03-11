import React from "react";
import { jsPDF } from "jspdf";

// type
export default function SuperSimple() {
  const doc = new jsPDF("p", "in", "letter", true);

  doc.setFont("helvetica", "normal");

  doc.setLineWidth(0.01);

  doc.text('test', 0.5, 0.75);

  doc.setFontSize(12);

  doc.save('test.pdf');

  return null;

}




