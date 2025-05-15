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