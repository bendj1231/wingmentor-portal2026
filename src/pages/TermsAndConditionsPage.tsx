import React from 'react';
import { Icons } from '../icons';

interface TermsAndConditionsPageProps {
    onBack: () => void;
}

export const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ onBack }) => {
    return (
        <div className="animate-fade-in" style={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.6
        }}>
            {/* Sticky Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #e2e8f0',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 100
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                >
                    <Icons.ArrowLeft style={{ width: 18, height: 18 }} />
                    Back to Enrollment
                </button>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', color: '#1e293b' }}>
                    WINGMENTOR LEGAL FRAMEWORK v2026.1
                </div>
                <div style={{ width: '100px' }}></div> {/* Spacer */}
            </header>

            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 2rem 10rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div style={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.3em', fontSize: '0.75rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                        Official Terms of Service
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem', lineHeight: 1.1 }}>
                        WingMentor Experience <br /> Agreement
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                        Please read this document carefully. By checking the agreement box during enrollment, you are entering into a legally binding contract.
                    </p>
                    <div style={{ marginTop: '3rem', padding: '1rem 2rem', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'inline-block', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontWeight: 600, color: '#475569' }}>Effective Date:</span> February 26, 2026
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>

                    {/* Article 1 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>01</span>
                            Definition of "The Experience"
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                WingMentor (hereinafter referred to as "The Experience", "The Platform", or "The Provider") is explicitly defined as a <strong>Pilot Quality Assurance (PQA)</strong> and <strong>Credibility Experience provider</strong>. It is not, and shall not be construed as, a flight training center, flight school, or academic institution under any jurisdiction including but not limited to FAA Part 141, Part 142, or EASA equivalent regulations.
                            </p>
                            <p>
                                The Experience is designed to provide high-level mentorship, peer-to-peer consultation, and exposure to industry-standard Evidence-Based Training (EBT) and Competency-Based Training and Assessment (CBTA) workflows. By participating, you acknowledge that you are not receiving formal instruction for the issuance of certificates, ratings, or licenses.
                            </p>
                            <p>
                                The Participant ("The Mentee") acknowledges that "The Experience" serves as a bridge for the "Pilot Gap"—defined as the developmental phase between initial qualification and full professional airline integration.
                            </p>
                        </div>
                    </section>

                    {/* Article 2 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>02</span>
                            Pilot Quality Assurance Standards
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                All Pilot Quality Assurance (PQA) metrics generated within The Experience are proprietary to WingMentor and are derived from standardized assessment rubrics. These rubrics are designed to measure "Core Competencies" as recognized by the international aviation community.
                            </p>
                            <p>
                                Mentees agree that their performance data, including grading sheets, simulator performance logs, and mentor evaluations, will be aggregated into a central database for the purpose of industry advocacy and profile synthesis.
                            </p>
                            <p style={{ padding: '1.5rem', borderLeft: '4px solid #2563eb', backgroundColor: '#eff6ff', borderRadius: '0 8px 8px 0 italic' }}>
                                "The PQA scoring is an indicative measure of professional aptitude and leadership potential, not a certification of technical flight proficiency for regulatory purposes."
                            </p>
                        </div>
                    </section>

                    {/* Article 3 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>03</span>
                            Infrastructure & Credibility Portfolios
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                Success in the aviation industry relies on verifiable credibility. WingMentor provides the infrastructure for Mentees to build a <strong>Data-Driven Portfolio</strong>. This portfolio is intended for presentation to potential employers, Approved Training Organizations (ATOs), and insurance underwriters.
                            </p>
                            <p>
                                The Mentee grants WingMentor an irrevocable, global license to synthesize their participation data into these portfolios. WingMentor reserves the right to authenticate all claims made within the portfolio through its proprietary peer-verification and mentor-audit systems.
                            </p>
                        </div>
                    </section>

                    {/* Article 4 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>04</span>
                            Liability Disclaimer for Third-Party Assets
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                The Experience utilizes specialized software applications, training modules, and technical documentation provided by third-party aerospace manufacturers, including but not limited to <strong>Airbus</strong>.
                            </p>
                            <p>
                                <strong>WingMentor explicitly disclaims any and all legal liability</strong> arising from the use of these third-party materials. This includes, but is not limited to:
                            </p>
                            <ul style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li>Inaccuracies in technical manuals or performance data.</li>
                                <li>Service outages or technical failures of manufacturer-hosted apps.</li>
                                <li>Data security breaches on third-party servers.</li>
                                <li>Discrepancies between experimental modules and current operational fleet standards.</li>
                            </ul>
                            <p>
                                By agreeing to these terms, you acknowledge that your interaction with these third-party tools is governed by their respective End User License Agreements (EULAs), for which WingMentor is not a party.
                            </p>
                        </div>
                    </section>

                    {/* Article 5 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>05</span>
                            The "Pilot Gap" & Carrier Readiness
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                The aviation industry faces a "Pilot Gap" where new graduates lack the leadership and CRM depth required for the modern multi-crew flight deck. WingMentor addresses this through high-level consultation.
                            </p>
                            <p>
                                However, completion of the WingMentor Foundational Program or any associated specific mentorship certificate <strong>does not guarantee</strong> employment, placement, or successful passing of any airline's official selection process. WingMentor acts as an advocate and a preparer, not a placement agency.
                            </p>
                        </div>
                    </section>

                    {/* Article 6 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>06</span>
                            Intellectual Property & Data Rights
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                All materials provided within The Experience, including mentorship guides, scenario designs, EBT grading logic, and proprietary software interfaces, are the exclusive intellectual property of WingMentor or its licensors.
                            </p>
                            <p>
                                Mentees are granted a limited, non-transferable license to use these materials solely for their personal professional development during the duration of their enrollment. Any redistribution, replication, or unauthorized public performance of these materials is strictly prohibited and will result in immediate legal action.
                            </p>
                        </div>
                    </section>

                    {/* Article 7 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>07</span>
                            Professional Compliance & Ethics
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                Integrity is the core value of aviation. Mentees are expected to maintain the highest standards of professional conduct. Any falsification of session data, misrepresentation of credentials, or unethical behavior during peer mentorship modules will result in immediate permanent expulsion from The Platform.
                            </p>
                            <p>
                                All "logged" mentorship hours must be verifiable. Falsification of logs within The Platform is a breach of contract and may be reported to relevant aviation safety bodies if deemed a risk to professional standards.
                            </p>
                        </div>
                    </section>

                    {/* Article 8 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>08</span>
                            Limitation of Damages
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                <strong>To the maximum extent permitted by applicable law</strong>, WingMentor, its founders, mentors, and partners shall not be held liable for any incidental, indirect, or consequential damages resulting from your participation in The Experience.
                            </p>
                            <p>
                                This includes, but is not limited to, loss of potential earnings, failure to pass official flight tests, or emotional distress associated with professional career trajectories. Our total liability for any claim arising out of these terms shall not exceed the total amount of service fees paid by the Mentee for the current term of enrollment.
                            </p>
                        </div>
                    </section>

                    {/* Article 9 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>09</span>
                            Global Data Advocacy
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                WingMentor acts as an advocate for the pilot community. By participating, you contribute to a global data set that allows WingMentor to present the needs and performance metrics of modern pilots to airlines and manufacturers.
                            </p>
                            <p>
                                You agree that anonymized, aggregated data from your participation may be used in official industry presentations, research papers, and career fair panels to improve the global standard of pilot entry-level competency.
                            </p>
                        </div>
                    </section>

                    {/* Article 10 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>10</span>
                            Governing Law & Jurisdiction
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which WingMentor is officially registered. Any disputes arising from this agreement that cannot be resolved through internal mediation shall be settled in the competent courts of that jurisdiction.
                            </p>
                        </div>
                    </section>

                    {/* Article 11 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>11</span>
                            Termination of Access
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                WingMentor reserves the right to terminate or suspend access to The Platform at its sole discretion, without prior notice, for conduct that WingMentor believes violates these terms or is harmful to other participants, WingMentor's industry reputation, or the safety principles of the aviation community.
                            </p>
                        </div>
                    </section>

                    {/* Article 12 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>12</span>
                            Updates to the Agreement
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                As WingMentor evolves alongside industry standards and manufacturing partnerships, these terms may be updated. Mentees will be notified of significant changes via the portal. Continued use of The Platform constitutes acceptance of the revised terms.
                            </p>
                        </div>
                    </section>

                    {/* Article 13 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>13</span>
                            Entire Agreement
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                This Agreement constitutes the entire understanding between the Mentee and WingMentor regarding "The Experience" and supersedes all prior agreements, representations, or understandings, whether oral or written.
                            </p>
                        </div>
                    </section>

                    {/* --- NEW CONTENT TO REACH 12 PAGES DEPTH --- */}

                    {/* Article 14 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>14</span>
                            Detailed Data Usage Policy for Pilot Metrics
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                The generation of Pilot Metrics is the cornerstone of the Pilot Quality Assurance (PQA) mandate. WingMentor utilizes a multi-layered data ingestion process to ensure accuracy and professional relevance.
                            </p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>14.1 Metric Categorization</h3>
                            <p>
                                Data points collected include, but are not limited to: Core Technical Knowledge (CTK), Crew Resource Management Proficiency (CRMP), Leadership and Command Potential (LCP), and Situational Stress Resilience (SSR). These metrics are assessed during simulated scenarios and peer interactions.
                            </p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>14.2 Data Storage and Security</h3>
                            <p>
                                WingMentor employs industry-standard encryption protocols for the storage of all participant data. While we strive for maximum security, the nature of digital platforms involves inherent risks. Participants acknowledge that WingMentor cannot guarantee absolute immunity from cyber-threats or unauthorized data breaches.
                            </p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>14.3 Industry Benchmarking</h3>
                            <p>
                                Individual metrics are compared against a global baseline established by senior airline captains and industry evaluators. This benchmarking process is recursive and updates as new industry standards (such as updated EBT/CBTA frameworks) are released by international bodies.
                            </p>
                        </div>
                    </section>

                    {/* Article 15 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>15</span>
                            Manufacturer-Specific Modules (Airbus & Others)
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                The Experience may provide access to proprietary modules designed to simulate the expectations of specific aircraft manufacturers, most notably **Airbus**.
                            </p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>15.1 Non-Endorsement Clause</h3>
                            <p>
                                Access to these modules does not imply an official endorsement by the manufacturer of the Mentee's specific flight skills. These modules are "diagnostic previews" and are not official manufacturer certification paths.
                            </p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>15.2 Intellectual Property Restrictions</h3>
                            <p>
                                Any screenshots, recordings, or telemetry data captured from manufacturer-specific modules are strictly confidential. Sharing such materials on public forums, social media, or with competitors constitutes a major breach of this agreement and may lead to prosecution for intellectual property theft by both WingMentor and the respective manufacturer.
                            </p>
                        </div>
                    </section>

                    {/* Article 16 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>16</span>
                            Social Media & Public Representation
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                Mentees are encouraged to share their progress within the "Experience" community. However, professional decorum must be maintained.
                            </p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>16.1 Publicity Rights</h3>
                            <p>
                                By participating, you grant WingMentor the non-exclusive right to use your general feedback, graduation status, and peer-mentorship highlights in promotional materials, including social media posts, website testimonials, and industry press releases.
                            </p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>16.2 Misrepresentation Penalty</h3>
                            <p>
                                Any Mentee who publicly misrepresents the WingMentor Experience as a "Flight School" or "Authorized Training Center" (claims that could damage WingMentor's regulatory standing) will have their account immediately terminated and any issued certificates revoked.
                            </p>
                        </div>
                    </section>

                    {/* Article 17 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>17</span>
                            Dispute Resolution & Arbitration
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                In the event of a dispute between the Mentee and WingMentor, the parties agree to first seek resolution through formal internal mediation conducted by a mutually agreed-upon aviation professional.
                            </p>
                            <p>
                                If mediation fails, the dispute shall be settled by binding arbitration in accordance with the International Chamber of Commerce (ICC) rules. The place of arbitration shall be the jurisdiction of WingMentor's registration. Both parties agree that any legal proceedings will be conducted on an individual basis and not as a class action or representative action.
                            </p>
                        </div>
                    </section>

                    {/* Article 18 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>18</span>
                            Fees & Refund Policy
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                Access to The Experience is provided upon payment of the relevant enrollment or subscription fees. These fees cover the cost of platform maintenance, mentor coordination, and industry advocacy initiatives.
                            </p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>18.1 No-Refund Clause</h3>
                            <p>
                                Given the digital nature of the content and the immediate granting of access to proprietary frameworks, all fees are non-refundable once enrollment is completed and the agreement is signed.
                            </p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>18.2 Subscription Continuity</h3>
                            <p>
                                Subscriptions are automatically renewed unless cancelled by the Mentee at least 48 hours prior to the next billing cycle. Failure to cancel in time results in a non-refundable charge for the subsequent period.
                            </p>
                        </div>
                    </section>

                    {/* Article 19 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>19</span>
                            Force Majeure
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                WingMentor shall not be liable for any failure to perform its obligations under this Agreement if such failure results from circumstances beyond its reasonable control, including but not limited to: global health crises, cyber-attacks on infrastructure, acts of God, war, civil unrest, or major regulatory changes in the aviation industry that impact the feasibility of The Platform's current model.
                            </p>
                        </div>
                    </section>

                    {/* Article 20 */}
                    <section>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#2563eb', fontSize: '1rem', fontWeight: 900 }}>20</span>
                            Electronic Consent & Finality
                        </h2>
                        <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p>
                                By checking the agreement box on the enrollment page, the Mentee confirms they have read, understood, and agreed to all 20 articles of this Agreement. This electronic action constitutes a valid digital signature under the Electronic Signatures in Global and National Commerce Act (E-SIGN Act) and similar international legislation.
                            </p>
                            <div style={{
                                marginTop: '4rem',
                                padding: '3rem',
                                border: '2px dashed #e2e8f0',
                                borderRadius: '24px',
                                textAlign: 'center',
                                backgroundColor: '#fcfdfe'
                            }}>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                    End of WingMentor Experience Agreement <br />
                                    Document ID: WM-LGL-2026-001 <br />
                                    All Rights Reserved © 2026 WingMentor
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Bottom Advocacy Banner */}
            <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Industry Credibility Starts Here</h2>
                <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>Building the future of Pilot Quality Assurance.</p>
                <button
                    onClick={onBack}
                    style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 3rem',
                        borderRadius: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                    I Acknowledge and Return
                </button>
            </div>
        </div>
    );
};
