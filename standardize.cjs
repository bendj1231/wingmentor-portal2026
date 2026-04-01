const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/PilotGapModulePage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The pattern to match a Wingmentor Insight card wrapper up to the closing div
// It starts with <div style={{... backdropFilter... }}>
// Then includes <img src="/logo.png"
// Then WINGMENTOR INSIGHT
// Then an <h2> or <h3>
// Then some content
// Ends with exactly matching </div>

// We will do a state-based text replacement to be safe.
const lines = content.split('\n');
let newLines = [];
let i = 0;
let replacedCount = 0;

while (i < lines.length) {
    if (lines[i].includes("backgroundColor: 'rgba(255, 255, 255, 0.7)'") &&
        lines[i + 1] && lines[i + 1].includes("backdropFilter: 'blur(16px)'")) {

        let startIdx = i - 1; // Assuming <div style={{ is on the previous line
        if (!lines[startIdx].includes("<div style={{")) {
            startIdx = i; // in case it's on the same line
        }

        // Let's scan forward to see if this is a WINGMENTOR INSIGHT card
        let isInsightCard = false;
        let isHardTruth = false;
        let scanIdx = startIdx;
        let endIdx = -1;
        let divDepth = 0;

        for (let j = startIdx; j < lines.length; j++) {
            if (lines[j].includes('<div')) divDepth += (lines[j].match(/<div/g) || []).length;
            if (lines[j].includes('</div')) divDepth -= (lines[j].match(/<\/div/g) || []).length;

            if (lines[j].includes('WINGMENTOR INSIGHT')) isInsightCard = true;
            if (lines[j].includes('HARD TRUTH')) isHardTruth = true;

            if (divDepth === 0 && j > startIdx) {
                endIdx = j;
                break;
            }
        }

        if (isInsightCard && !isHardTruth && endIdx !== -1 && startIdx >= 0) {
            // It is a WINGMENTOR INSIGHT card!
            let cardLines = lines.slice(startIdx, endIdx + 1);
            let cardStr = cardLines.join('\n');

            // Extract heading text
            let headingMatch = cardStr.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/);
            let headingText = headingMatch ? headingMatch[1].trim() : "Insight Title";

            // Extract content (everything after heading, before the closing </div>)
            let contentStart = cardStr.indexOf(headingMatch ? headingMatch[0] : "") + (headingMatch ? headingMatch[0].length : 0);
            let contentEnd = cardStr.lastIndexOf('</div>');
            let innerContent = cardStr.substring(contentStart, contentEnd).trim();

            // Strip existing outer <p> tag stylings if we want, or just wrap it. 
            // The user wants the <p> styled like: <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>
            // Let's regex replace <p style={...}> with the standard one.
            innerContent = innerContent.replace(/<p style={{[^}]*}}>/g, `<p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto', maxWidth: '40rem', textAlign: 'left' }}>`);

            // Standardized Wrapper
            const standardCard = `                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    borderRadius: '24px',
                                    padding: '4rem 3rem',
                                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    textAlign: 'center',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                    <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        WINGMENTOR INSIGHT
                                    </div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                                        ${headingText}
                                    </h2>
                                    ${innerContent}
                                </div>`;

            newLines.push(standardCard);
            i = endIdx + 1;
            replacedCount++;
            continue;
        }
    }

    newLines.push(lines[i]);
    i++;
}

fs.writeFileSync(filePath, newLines.join('\n'));
console.log(`Successfully standardized ${replacedCount} Wingmentor Insight cards.`);
