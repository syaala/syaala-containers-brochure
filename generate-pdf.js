#!/usr/bin/env node

/**
 * Generate PDF from brochure HTML using Puppeteer
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  console.log('🚀 Starting PDF generation...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Load the HTML file
    const htmlPath = path.join(__dirname, 'brochure-product.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Set content and wait for images to load
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'domcontentloaded']
    });

    console.log('📄 Generating PDF...');

    // Generate PDF with landscape A4 settings
    const pdfPath = path.join(__dirname, 'Syaala-Containers-Brochure.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    console.log(`✅ PDF generated successfully: ${pdfPath}`);

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

generatePDF().catch(console.error);
