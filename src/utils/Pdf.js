import html2pdf from "html2pdf.js";
import Mustache from "mustache";
import template from "../../template.html?raw";
export const generatePDF = async (data) => {
    // Render HTML from Mustache template
    console.log(data)
    const rendered = Mustache.render(template, data);

    // Create container element
    const container = document.createElement('div');
    container.innerHTML = rendered;
    document.body.appendChild(container); // Optionally hide it with `style="display: none"`

    // Generate PDF from rendered HTML
    html2pdf().from(container).then((data) => {
        console.log(data)
    }).save(`invoice_${data.orderInfo.number}.pdf`);

    // Optional: remove the temporary element
    setTimeout(() => container.remove(), 2000);

};

export const printPdf = (pdfUrl) => {
    try {
        console.log(pdfUrl)
        const printWindow = window.open(pdfUrl, "_blank");
        console.log(printWindow, "pdf window")
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        } else {
            console.error('Failed to open print window');
        }
    } catch (error) {
        console.log(error)
    }

};