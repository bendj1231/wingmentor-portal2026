import re

with open('src/pages/PilotGapModulePage.tsx', 'r') as f:
    content = f.read()

# 1. Add import for HTMLFlipBook
import_pageflip = "import HTMLFlipBook from 'react-pageflip';\n"
content = content.replace("import React,", import_pageflip + "import React,")

# 2. Add BookPage component definition
bookpage_def = """
const BookPage = React.forwardRef((props: any, ref: any) => {
    return (
        <div className="demoPage" ref={ref} style={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100%',
            padding: '2.5rem 3rem',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)',
            position: 'relative'
        }}>
            {/* Soft inner shadow for the spine depending on left/right page */}
            <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                [props.number % 2 === 0 ? 'left' : 'right']: 0,
                width: '40px',
                background: `linear-gradient(to ${props.number % 2 === 0 ? 'right' : 'left'}, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 100%)`,
                pointerEvents: 'none'
            }} />
            <div style={{ paddingBottom: '3rem' }}>
                {props.children}
            </div>
            
            <div style={{
                position: 'absolute',
                bottom: '1rem',
                [props.number % 2 === 0 ? 'left' : 'right']: '2rem',
                fontSize: '0.8rem',
                color: '#94a3b8',
                fontWeight: 600
            }}>
                {props.number}
            </div>
        </div>
    );
});
"""
content = re.sub(r'(const PilotGapModulePage = \(\{ onBack \}: \{ onBack: \(\) => void \}\) => \{)', bookpage_def + r'\n\1', content)

# 3. Add bookRef and handle page flip methods
bookref_setup = """
    const bookRef = useRef<any>(null);

    const onPage = (e: any) => {
        // Sync the current page back to sidebar/chapter states if needed, though for now we can just rely on sidebar clicking
        const pageIndex = e.data;
        const step = navigationFlow[pageIndex];
        if (step) {
            setCurrentChapter(step.chapter);
            setCurrentTopic(step.topic);
        }
    };
"""
content = content.replace("const contextMenuRef = useRef<HTMLDivElement>(null);", "const contextMenuRef = useRef<HTMLDivElement>(null);\n" + bookref_setup)

# 4. Remove all hardcoded Next/Prev buttons within chapters
nav_pattern = r'<div style=\{\{ display: \'flex\', alignItems: \'center\', justifyContent: \'space-between\', paddingBottom: \'6rem\' \}\}>.*?Next →\s*</button>\s*</div>'
content = re.sub(nav_pattern, '', content, flags=re.DOTALL)
content = re.sub(r'<div style=\{\{ height: \'1px\', background: \'#e2e8f0\', marginBottom: \'2rem\' \}\} />(?=\s*(?:</div>|\n\s*//))', '', content)

# 5. Modify renderChapterContent to accept params rather than using state, and rename
content = content.replace("const renderChapterContent = () => {", "const renderPageContent = (targetChapter: number, targetTopic: string | null) => {")
content = re.sub(r'\bcurrentChapter\b(?! === )', 'targetChapter', content) # Only replace currentChapter when it's being used conceptually in render logic, wait actually it's mostly switch(currentChapter)
content = content.replace("switch (currentChapter)", "switch (targetChapter)")
content = content.replace("currentTopic ===", "targetTopic ===")

# 6. Replace the main content rendering
main_content_old = """
                        {renderChapterContent()}

                        {/* Pagination Controls */}
"""
main_content_new = """
                        <div style={{ height: '75vh', minHeight: '600px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <HTMLFlipBook
                                width={550}
                                height={750}
                                size="stretch"
                                minWidth={315}
                                maxWidth={1000}
                                minHeight={400}
                                maxHeight={1533}
                                drawShadow={true}
                                flippingTime={700}
                                usePortrait={true}
                                startZIndex={0}
                                autoSize={true}
                                maxShadowOpacity={0.3}
                                showCover={true}
                                mobileScrollSupport={true}
                                className="pilot-gap-book"
                                ref={bookRef}
                                onFlip={onPage}
                            >
                                {navigationFlow.map((step, index) => (
                                    <BookPage key={index} number={index + 1}>
                                        {renderPageContent(step.chapter, step.topic)}
                                    </BookPage>
                                ))}
                            </HTMLFlipBook>
                        </div>

                        {/* Pagination Controls */}
"""
content = content.replace("{renderChapterContent()}", main_content_new.strip())

# 7. Update sidebar clicks to call turnToPage
content = content.replace(
    "setCurrentChapter(item.id);\n                                                setCurrentTopic(null);\n                                                window.scrollTo({ top: 0, behavior: 'smooth' });",
    "const idx = navigationFlow.findIndex(n => n.chapter === item.id && !n.topic); if (idx !== -1 && bookRef.current) bookRef.current.pageFlip().turnToPage(idx);"
)
content = content.replace(
    "setCurrentTopic(topic.slug); window.scrollTo({ top: 0, behavior: 'smooth' });",
    "const idx = navigationFlow.findIndex(n => n.topic === topic.slug); if (idx !== -1 && bookRef.current) bookRef.current.pageFlip().turnToPage(idx);"
)

# 8. Update bottom next/prev to flip book
content = content.replace(
    "onClick={handleNext}",
    "onClick={() => { if (bookRef.current) bookRef.current.pageFlip().flipNext(); handleNext(); }}"
)
content = content.replace(
    "onClick={handlePrev}",
    "onClick={() => { if (bookRef.current) bookRef.current.pageFlip().flipPrev(); handlePrev(); }}"
)


with open('src/pages/PilotGapModulePage.tsx', 'w') as f:
    f.write(content)

print("Refactoring complete.")
