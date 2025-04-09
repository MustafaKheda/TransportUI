import { html2pdf } from "html2pdf.js";
import Mustache from "mustache";
import template from "../../template.html?raw";
export const generatePDF = (data) => {
    // Render HTML from Mustache template
    const rendered = Mustache.render(template, data);

    // Create container element
    const container = document.createElement('div');
    container.innerHTML = rendered;
    document.body.appendChild(container); // Optionally hide it with `style="display: none"`

    // Generate PDF from rendered HTML
    html2pdf().from(container).save("invoice.pdf");

    // Optional: remove the temporary element
    setTimeout(() => container.remove(), 2000);
};