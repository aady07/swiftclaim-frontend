import jsPDF from 'jspdf';

export const generateClaimReport = (data) => {
  try {
    const {
      carMake,
      carModel,
      damageLabel,
      confidenceScore,
      damagedParts,
      costEstimates,
      previewUrl,
      damageImageUrl,
      partsImageUrl
    } = data;

    // Validate required data
    if (!carMake || !carModel) {
      throw new Error('Missing required vehicle information');
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(14, 14, 182, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Miraista`, 20, 22);
    doc.text(`Vehicle Assessment Report`, 105, 22, { align: 'center' });

    // Vehicle Info
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Vehicle: ${carMake} ${carModel}`, 20, 32);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 38);

    // Assessment Results
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(14, 45, 182, 25, 3, 3, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text("Assessment Results", 20, 55);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    // Damage Status
    const damageStatus = damageLabel ? damageLabel.toUpperCase() : "N/A";
    doc.setTextColor(damageLabel?.toLowerCase() === "damage" ? 220 : 25, 
                    damageLabel?.toLowerCase() === "damage" ? 53 : 135, 
                    damageLabel?.toLowerCase() === "damage" ? 69 : 84);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Assessment Result: ${damageStatus}`, 20, 63);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Confidence Score: ${confidenceScore || 'N/A'}%`, 120, 63);

    try {
      // Add Damaged Parts
      addDamagedPartsSection(doc, damagedParts);
    } catch (error) {
      console.error('Error adding damaged parts section:', error);
    }

    try {
      // Add Cost Estimates
      addCostEstimatesSection(doc, costEstimates, damagedParts);
    } catch (error) {
      console.error('Error adding cost estimates section:', error);
    }

    try {
      // Add Images
      if (damageImageUrl || previewUrl || partsImageUrl) {
        addImagesSection(doc, previewUrl, damageImageUrl, partsImageUrl);
      }
    } catch (error) {
      console.error('Error adding images section:', error);
    }

    try {
      // Add Footer
      addFooter(doc);
    } catch (error) {
      console.error('Error adding footer:', error);
    }

    return doc;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

const addDamagedPartsSection = (doc, damagedParts) => {
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(14, 75, 182, 70, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text("Damaged Parts", 20, 85);

  let yPos = 95;
  if (damagedParts && damagedParts.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    damagedParts.forEach((part) => {
      doc.setFillColor(220, 53, 69);
      doc.circle(20, yPos - 1, 1.5, 'F');
      doc.setTextColor(50, 50, 50);
      doc.text(formatPartName(part), 25, yPos);
      yPos += 10;
    });
  } else {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('No damaged parts identified', 25, yPos);
  }
};

const addCostEstimatesSection = (doc, costEstimates, damagedParts) => {
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(14, 150, 182, 100, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text("Repair Cost Estimates", 20, 160);

  let yPos = 170;
  if (costEstimates && costEstimates.length > 0) {
    // Table header
    doc.setFillColor(200, 200, 200);
    doc.rect(20, yPos - 7, 140, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text("Part", 25, yPos - 1);
    doc.text("Estimated Cost (₹)", 120, yPos - 1);

    // Table content
    doc.setFont('helvetica', 'normal');
    yPos += 8;
    costEstimates.forEach((cost, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, yPos - 7, 140, 8, 'F');
      }
      const partName = damagedParts && damagedParts[index] 
        ? formatPartName(damagedParts[index]) 
        : `Estimate ${index + 1}`;
      doc.setTextColor(50, 50, 50);
      doc.text(partName, 25, yPos - 1);
      
      // Format cost with proper currency symbol and range
      const formattedCost = formatCost(cost);
      doc.text(`₹ ${formattedCost}`, 120, yPos - 1);
      yPos += 8;
    });

    // Total cost
    yPos += 5;
    doc.setFillColor(15, 23, 42);
    doc.rect(20, yPos - 7, 140, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text("Total Estimated Cost:", 25, yPos - 1);
    const totalRange = getTotalCostRange(costEstimates);
    doc.text(`₹ ${totalRange}`, 120, yPos - 1);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('No cost estimates available', 25, yPos);
  }
};

const addImagesSection = (doc, previewUrl, damageImageUrl, partsImageUrl) => {
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(14, 14, 182, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Miraista`, 20, 22);
  doc.text(`Damage Analysis Images`, 105, 22, { align: 'center' });

  let yPos = 40;
  const imageWidth = 80;
  const imageHeight = 60;
  const margin = 20;

  // Helper function to add image with error handling
  const addImageWithErrorHandling = (imageUrl, title, x, y) => {
    try {
      if (!imageUrl) return false;

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(12);
      doc.text(title, x, y);

      // Handle different image URL formats
      let imageData;
      if (typeof imageUrl === 'string') {
        if (imageUrl.startsWith('data:image/')) {
          imageData = imageUrl;
        } else if (imageUrl.startsWith('blob:')) {
          // For blob URLs, we'll handle them synchronously
          return false; // Skip blob URLs for now as they need async handling
        } else {
          // Assume it's a base64 string without the data URL prefix
          imageData = `data:image/png;base64,${imageUrl}`;
        }
      } else {
        return false;
      }

      // Add the image with a try-catch block
      if (imageData) {
        try {
          doc.addImage(imageData, 'JPEG', x, y + 5, imageWidth, imageHeight, undefined, 'FAST');
          return true;
        } catch (imgError) {
          console.error('Error adding image to PDF:', imgError);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error(`Error processing image ${title}:`, error);
      return false;
    }
  };

  // Add original upload image
  if (previewUrl) {
    const imageAdded = addImageWithErrorHandling(previewUrl, "Original Upload", margin, yPos);
    if (imageAdded) {
      yPos += imageHeight + 30;
    }
  }

  // Add damage analysis image
  if (damageImageUrl) {
    const imageAdded = addImageWithErrorHandling(damageImageUrl, "Damage Analysis", margin, yPos);
    if (imageAdded) {
      yPos += imageHeight + 30;
    }
  }

  // Add parts analysis image
  if (partsImageUrl) {
    const imageAdded = addImageWithErrorHandling(partsImageUrl, "Parts Analysis", margin, yPos);
    if (imageAdded) {
      yPos += imageHeight + 30;
    }
  }

  // If no images were added, show a message
  if (yPos === 40) {
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(12);
    doc.text("No images available for this report", margin, yPos);
  }
};

const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 280, 196, 280);
    doc.text("Miraista Vehicle Damage Assessment", 14, 287);
    doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: 'right' });
  }
};

const formatPartName = (part) => {
  if (!part) return "";
  return part
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatCost = (cost) => {
  if (!cost) return "0";
  
  // Handle range format (e.g., "200-300" or "200 - 300")
  if (typeof cost === 'string' && cost.includes('-')) {
    const [min, max] = cost.split('-').map(val => val.trim());
    const formattedMin = formatSingleCost(min);
    const formattedMax = formatSingleCost(max);
    return `${formattedMin} - ${formattedMax}`;
  }
  
  return formatSingleCost(cost);
};

const formatSingleCost = (cost) => {
  if (!cost) return "0";
  // Remove any non-numeric characters except decimal point
  const numericCost = cost.toString().replace(/[^0-9.]/g, '');
  // Convert to number and format with thousands separator
  return parseFloat(numericCost).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
};

const getTotalCostRange = (costs) => {
  if (!costs || costs.length === 0) return "0";
  
  const total = costs.reduce((sum, cost) => {
    if (typeof cost === 'string' && cost.includes('-')) {
      // For range costs, take the average
      const [min, max] = cost.split('-').map(val => {
        const num = val.trim().replace(/[^0-9.]/g, '');
        return parseFloat(num || 0);
      });
      return sum + ((min + max) / 2);
    }
    // For single costs
    const numericCost = cost.toString().replace(/[^0-9.]/g, '');
    return sum + parseFloat(numericCost || 0);
  }, 0);
  
  return total.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
}; 