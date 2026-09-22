import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { VocationalProfileResult } from '../types';
import yungayImgUrl from '../assets/images/yungay_valle_huascaran_1790107561223.jpg';
import refugioImgUrl from '../assets/images/refugio_huascaran_1790047638479.jpg';

/**
 * Converts an image path to Base64 data URL for rock-solid PDF rendering without CORS/taint issues
 */
async function toDataUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

export async function generateVocationalPdf(profile: VocationalProfileResult): Promise<void> {
  // Pre-load base64 images of Yungay and Huascarán
  const yungayImgBase64 = await toDataUrl(yungayImgUrl);
  const refugioImgBase64 = await toDataUrl(refugioImgUrl);

  const today = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Create an offscreen container for rendering high-res print document (A4 proportions: 800px width)
  const container = document.createElement('div');
  container.id = 'pdf-render-canvas-container';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-1000';

  container.innerHTML = `
    <div style="width: 800px; padding: 26px 32px; background: #ffffff; color: #0f172a; box-sizing: border-box; line-height: 1.35;">
      
      <!-- ============================================================= -->
      <!-- HEADER BANNER: COLECTIVO VOCACIONAL VALLE DEL HUASCARÁN       -->
      <!-- ============================================================= -->
      <div style="position: relative; border-radius: 18px; overflow: hidden; height: 165px; margin-bottom: 18px; box-shadow: 0 4px 18px rgba(0,0,0,0.18);">
        ${yungayImgBase64 ? `
          <img 
            src="${yungayImgBase64}" 
            style="width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block;" 
            alt="Yungay y Nevado Huascarán"
          />
        ` : ''}
        <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(13,148,136,0.85) 60%, rgba(16,185,129,0.75) 100%);"></div>
        
        <div style="position: absolute; inset: 0; padding: 18px 24px; display: flex; flex-direction: column; justify-content: space-between; color: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.3); padding: 3px 12px; font-size: 10px; font-weight: 800; color: #ffffff; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.8px;">
                🏔️ Áncash • Callejón de Huaylas • Yungay
              </div>
              <h1 style="margin: 8px 0 0 0; font-size: 22px; font-weight: 900; letter-spacing: -0.3px; color: #ffffff; text-transform: uppercase;">
                COLECTIVO VOCACIONAL VALLE DEL HUASCARÁN
              </h1>
              <div style="margin: 3px 0 0 0; font-size: 13px; color: #a7f3d0; font-weight: 800; letter-spacing: 0.3px;">
                RESULTADOS DE TU EVALUACIÓN VOCACIONAL
              </div>
            </div>
            
            <div style="text-align: right; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); padding: 6px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.25);">
              <div style="font-size: 9px; text-transform: uppercase; font-weight: 700; color: #94a3b8;">Emisión Oficial</div>
              <div style="font-size: 11px; font-weight: 800; color: #ffffff;">${today}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.25); padding-top: 8px; font-size: 10px; color: #e2e8f0; font-weight: 600;">
            <div style="display: flex; gap: 12px;">
              <span>🎓 75 Carreras Universitarias</span>
              <span>•</span>
              <span>⚙️ 37 Carreras Técnicas Superiores</span>
            </div>
            <div style="color: #6ee7b7; font-weight: 800;">
              📊 Fuente: Planilla Electrónica MTPE
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================= -->
      <!-- MAIN DIAGNOSIS PROFILE                                        -->
      <!-- ============================================================= -->
      <div style="background: linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%); border: 1.5px solid #99f6e4; border-radius: 14px; padding: 14px 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f766e; background: #ccfbf1; padding: 2px 8px; border-radius: 6px;">
            Tu Perfil Vocacional Predominante
          </span>
          <span style="font-size: 10px; color: #64748b; font-weight: 600;">
            100% Personalizado según tus Respuestas
          </span>
        </div>
        <h2 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 900; color: #0f172a;">
          ${profile.title}
        </h2>
        <p style="margin: 0; font-size: 11px; color: #334155; line-height: 1.45;">
          ${profile.description}
        </p>
      </div>

      <!-- ============================================================= -->
      <!-- COMPARATIVE CARDS: TÉCNICA vs UNIVERSITARIA                   -->
      <!-- ============================================================= -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
        
        <!-- CARD 1: CARRERA TÉCNICA -->
        <div style="background: #ffffff; border: 2px solid #0d9488; border-radius: 14px; padding: 14px; position: relative; box-shadow: 0 2px 8px rgba(13,148,136,0.08);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #0f766e; background: #ccfbf1; border: 1px solid #5eead4; padding: 2px 8px; border-radius: 6px;">
              ⚙️ Tu Posibilidad Técnica (3 años)
            </div>
            ${profile.recommendedTechnical.rank ? `
              <div style="font-size: 9px; font-weight: 800; color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 6px;">
                Top #${profile.recommendedTechnical.rank} MTPE
              </div>
            ` : ''}
          </div>

          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.25;">
            ${profile.recommendedTechnical.name}
          </h3>

          <p style="margin: 0 0 8px 0; font-size: 10px; color: #475569; line-height: 1.35;">
            ${profile.recommendedTechnical.description}
          </p>

          <!-- Salary Box -->
          <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 10px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
              <span style="font-size: 10px; font-weight: 800; color: #134e4a;">Sueldo promedio (-30 años):</span>
              <span style="font-size: 15px; font-weight: 900; color: #0f766e;">${profile.recommendedTechnical.avgYoung}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 10px; color: #115e59; padding-top: 3px; border-top: 1px dashed #99f6e4;">
              <span style="font-weight: 700;">Proyección (+30 años):</span>
              <span style="font-weight: 800; color: #0f172a;">${profile.recommendedTechnical.avgAdult}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 9px; color: #0f766e; margin-top: 3px; padding-top: 3px; border-top: 1px solid #ccfbf1;">
              <span style="font-weight: 600;">Mínimo - Máximo (+30 años):</span>
              <span style="font-weight: 800; color: #0f172a;">${profile.recommendedTechnical.rangeAdult || profile.recommendedTechnical.rangeYoung}</span>
            </div>
          </div>

          <!-- Key Institutes -->
          <div>
            <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 3px;">
              Institutos Sugeridos:
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 3px;">
              ${profile.recommendedTechnical.keyInstitutes.map(inst => `
                <span style="font-size: 9px; font-weight: 700; color: #1e293b; background: #f1f5f9; padding: 2px 6px; border-radius: 5px; border: 1px solid #cbd5e1;">
                  ${inst}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- CARD 2: CARRERA UNIVERSITARIA -->
        <div style="background: #ffffff; border: 2px solid #2563eb; border-radius: 14px; padding: 14px; position: relative; box-shadow: 0 2px 8px rgba(37,99,235,0.08);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #1e40af; background: #eff6ff; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 6px;">
              🎓 Tu Posibilidad Universitaria (5 años)
            </div>
            ${profile.recommendedUniversity.rank ? `
              <div style="font-size: 9px; font-weight: 800; color: #1d4ed8; background: #eff6ff; border: 1px solid #bfdbfe; padding: 2px 6px; border-radius: 6px;">
                Top #${profile.recommendedUniversity.rank} MTPE
              </div>
            ` : ''}
          </div>

          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.25;">
            ${profile.recommendedUniversity.name}
          </h3>

          <p style="margin: 0 0 8px 0; font-size: 10px; color: #475569; line-height: 1.35;">
            ${profile.recommendedUniversity.description}
          </p>

          <!-- Salary Box -->
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 10px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
              <span style="font-size: 10px; font-weight: 800; color: #1e3a8a;">Sueldo promedio (-30 años):</span>
              <span style="font-size: 15px; font-weight: 900; color: #1d4ed8;">${profile.recommendedUniversity.avgYoung}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 10px; color: #1e40af; padding-top: 3px; border-top: 1px dashed #bfdbfe;">
              <span style="font-weight: 700;">Proyección (+30 años):</span>
              <span style="font-weight: 800; color: #0f172a;">${profile.recommendedUniversity.avgAdult}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 9px; color: #1d4ed8; margin-top: 3px; padding-top: 3px; border-top: 1px solid #dbeafe;">
              <span style="font-weight: 600;">Mínimo - Máximo (+30 años):</span>
              <span style="font-weight: 800; color: #0f172a;">${profile.recommendedUniversity.rangeAdult || profile.recommendedUniversity.rangeYoung}</span>
            </div>
          </div>

          <!-- Key Universities -->
          <div>
            <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 3px;">
              Universidades Sugeridas:
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 3px;">
              ${profile.recommendedUniversity.keyUniversities.map(uni => `
                <span style="font-size: 9px; font-weight: 700; color: #1e293b; background: #f1f5f9; padding: 2px 6px; border-radius: 5px; border: 1px solid #cbd5e1;">
                  ${uni}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

      </div>

      <!-- ============================================================= -->
      <!-- SKILLS AND COMPETENCIES                                       -->
      <!-- ============================================================= -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; margin-bottom: 14px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f766e; margin-bottom: 6px;">
          ⚡ Competencias y Fortalezas Clave de tu Perfil
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          ${profile.skills.map(s => `
            <div style="font-size: 10px; color: #1e293b; display: flex; align-items: center; gap: 5px;">
              <span style="color: #0d9488; font-weight: 900;">✓</span>
              <span>${s}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ============================================================= -->
      <!-- ALLIED CONTACTS IN VALLE DEL HUASCARÁN                        -->
      <!-- ============================================================= -->
      ${profile.allyContacts.length > 0 ? `
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #fde68a; border-radius: 12px; padding: 10px 14px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #92400e;">
              👥 Estudiantes y Miembros Aliados en el Valle del Huascarán
            </div>
            <div style="font-size: 9px; color: #b45309; font-weight: 700;">
              Escríbeles para orientación vocacional
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            ${profile.allyContacts.map(c => `
              <div style="background: #ffffff; border: 1px solid #fcd34d; border-radius: 8px; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 10px; font-weight: 800; color: #0f172a;">${c.name}</div>
                  <div style="font-size: 9px; color: #0284c7; font-weight: 700;">${c.career} • ${c.institution}</div>
                </div>
                <div style="display: flex; gap: 3px;">
                  ${c.facebook ? `<span style="font-size: 8px; font-weight: 900; background: #1877f2; color: #ffffff; padding: 2px 5px; border-radius: 4px;">FB</span>` : ''}
                  ${c.instagram ? `<span style="font-size: 8px; font-weight: 900; background: #e1306c; color: #ffffff; padding: 2px 5px; border-radius: 4px;">IG</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- ============================================================= -->
      <!-- FOOTER NOTE WITH HUASCARAN CERTIFICATION                      -->
      <!-- ============================================================= -->
      <div style="position: relative; border-radius: 12px; overflow: hidden; padding: 12px 16px; background: #0f172a; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;">
        ${refugioImgBase64 ? `
          <img 
            src="${refugioImgBase64}" 
            style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.15; display: block;" 
            alt="Refugio Huascarán"
          />
        ` : ''}
        <div style="position: relative; z-index: 10; max-width: 530px;">
          <div style="font-size: 10px; font-weight: 800; color: #38bdf8;">
            Iniciativa Juvenil por el Valle del Huascarán y el Callejón de Huaylas
          </div>
          <div style="font-size: 8.5px; color: #cbd5e1; margin-top: 2px; line-height: 1.3;">
            Reporte emitido por el Colectivo Vocacional Valle del Huascarán. Fuente: MTPE (Planilla Electrónica) e información de estudiantes de Yungay y Áncash.
          </div>
        </div>
        <div style="position: relative; z-index: 10; text-align: right;">
          <div style="font-size: 10px; font-weight: 900; color: #5eead4;">ÁNCASH - PERÚ</div>
          <div style="font-size: 8px; color: #94a3b8;">Caminos de Éxito</div>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // 2x for crisp typography and clean print rendering
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      // If slightly longer, scale to fit the page cleanly
      const scale = (pageHeight - 4) / imgHeight;
      const scaledWidth = imgWidth * scale;
      const xOffset = (pageWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'JPEG', xOffset, 2, scaledWidth, pageHeight - 4);
    }
    
    // Clean, professional filename
    const safeCategory = profile.category.replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`Colectivo_Vocacional_Valle_del_Huascaran_${safeCategory}.pdf`);
  } finally {
    // Always clean up DOM container
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
