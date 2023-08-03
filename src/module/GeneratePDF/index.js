import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
// define a generatePDF function that accepts a account list argument
const generatePDF = (fileName)=> {
  // initialize jsPDF
  const doc = new jsPDF();

  var elementHTML = document.querySelector("#pdfHtml");

  doc.html(elementHTML, {
    callback: function(doc) {
        // Save the PDF
        doc.save(fileName);
    },
    margin: [8, 13, 10, 13],
    autoPaging: 'text',
    x: 0,
    y: 0,
    width: 184, //target width in the PDF document
    windowWidth: 675 //window width in CSS pixels
});
};

export default generatePDF;
