import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(54, 750, "TRAYA YUKTI (TYC) AI LMS — COMPLETE PLATFORM OVERVIEW")
            
            self.setFont("Helvetica", 8)
            self.drawRightString(612 - 54, 750, "Confidential & Comprehensive Guide")
            
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, 742, 612 - 54, 742)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 45, 612 - 54, 45)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 32, "© 2026 Traya Yukti Core (TYC) AI LMS. Learn • Build • Grow")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 32, page_str)
        
        self.restoreState()


def build_pdf(filename="Traya_Yukti_LMS_Complete_Overview.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#0F172A") # Slate 900
    brand_emerald = colors.HexColor("#059669") # Emerald 600
    accent_blue = colors.HexColor("#2563EB")   # Blue 600
    text_dark = colors.HexColor("#1E293B")     # Slate 800
    text_muted = colors.HexColor("#475569")    # Slate 600

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=brand_emerald,
        spaceAfter=14
    )

    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=text_muted
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=accent_blue,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=text_dark,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=text_dark,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#065F46")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=text_dark
    )

    table_bold_style = ParagraphStyle(
        'TableBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=primary_color
    )

    story = []

    # ==================== COVER / HEADER BANNER ====================
    story.append(Spacer(1, 10))
    story.append(Paragraph("TRAYA YUKTI (TYC) AI LMS", title_style))
    story.append(Paragraph("Next-Generation AI-Powered Learning Management System & Developer Ecosystem", subtitle_style))
    
    meta_info = [
        [
            Paragraph("<b>Version:</b> 2.5.0 Production Ready", meta_style),
            Paragraph("<b>Stack:</b> React 19, TypeScript, Vite, Tailwind CSS", meta_style),
            Paragraph("<b>Auth:</b> 6-Phase Mascot + Clerk Enterprise", meta_style)
        ]
    ]
    meta_table = Table(meta_info, colWidths=[160, 200, 144])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceBefore=0, spaceAfter=12))

    # ==================== SECTION 1 ====================
    story.append(Paragraph("1. Executive Summary & Core Mission", h1_style))
    story.append(Paragraph(
        "<b>Traya Yukti Core (TYC) LMS</b> is a state-of-the-art educational ecosystem architected to bridge academic learning and production software engineering. Built under the mantra <b>'Learn • Build • Grow'</b>, the platform combines interactive video courses, browser-based coding labs, portfolio generation, capstone project reviews, and context-aware generative AI mentoring.",
        body_style
    ))
    story.append(Paragraph(
        "Key value drivers of the platform include zero-friction authentication with a 3D responsive character state machine, granular Role-Based Access Control (RBAC), multi-track learning roadmaps, real-time gamified skill trees, and full administrative curriculum CMS management.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # ==================== SECTION 2 ====================
    story.append(Paragraph("2. Interactive Character Authentication & Security", h1_style))
    story.append(Paragraph(
        "The TYC authentication system features a master 3D mascot interface that dynamically reacts to user actions across six distinct interaction phases:",
        body_style
    ))

    phase_data = [
        [
            Paragraph("Phase", table_header_style),
            Paragraph("Trigger / State", table_header_style),
            Paragraph("Character Visual Reaction", table_header_style),
            Paragraph("Security & System Action", table_header_style)
        ],
        [
            Paragraph("<b>State 1</b>", table_bold_style),
            Paragraph("Email Focus / Input", table_body_style),
            Paragraph("Character looks towards input with 👀 badge", table_body_style),
            Paragraph("Real-time email format regex evaluation active", table_body_style)
        ],
        [
            Paragraph("<b>State 2</b>", table_bold_style),
            Paragraph("Valid Email Format", table_body_style),
            Paragraph("Thumbs-up approval with green ✓ badge", table_body_style),
            Paragraph("Green glowing border & checkmark displayed", table_body_style)
        ],
        [
            Paragraph("<b>State 3</b>", table_bold_style),
            Paragraph("Invalid Email / Mistake", table_body_style),
            Paragraph("Confused chin-scratch with purple ? badge", table_body_style),
            Paragraph("Red border, error alert, access strictly gated", table_body_style)
        ],
        [
            Paragraph("<b>State 4</b>", table_bold_style),
            Paragraph("Password Typing", table_body_style),
            Paragraph("Character covers eyes with 🙈 privacy badge", table_body_style),
            Paragraph("Client-side password masking & privacy guard", table_body_style)
        ],
        [
            Paragraph("<b>State 5</b>", table_bold_style),
            Paragraph("Valid Password (≥6)", table_body_style),
            Paragraph("Character smiles, looks back with 😊 badge", table_body_style),
            Paragraph("Password policy verified, submit button unlocked", table_body_style)
        ],
        [
            Paragraph("<b>State 6</b>", table_bold_style),
            Paragraph("Login Success", table_body_style),
            Paragraph("Hands-raised celebration with 🎉 neon badge", table_body_style),
            Paragraph("Confetti burst, progress bar, redirect to /dashboard", table_body_style)
        ],
    ]

    phase_table = Table(phase_data, colWidths=[55, 120, 165, 164])
    phase_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(phase_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Clerk Enterprise Authentication:</b> In addition to local RBAC accounts, the platform integrates production-grade Clerk Authentication (<code>@clerk/react</code>) linked to application <code>app_3IiIajRXTOubxyGOwlo5qDsQoAh</code>, offering Google OAuth, biometric authentication, and multi-factor security.", body_style))
    story.append(Spacer(1, 8))

    # ==================== SECTION 3 ====================
    story.append(Paragraph("3. Core Learning Modules & Functional Features", h1_style))
    
    modules_info = [
        ("📚 Course Catalog & Video Player", "Comprehensive multi-tier courses (Full Stack React 19, Python AI Backend, Cloud DevOps, Prompt Engineering) with video streaming, lesson notes, code snippets, and automated progress checkpointing."),
        ("🗺️ Guided Learning Paths", "Curated end-to-end career tracks guiding students from foundational concepts to advanced production deployments with milestone verification."),
        ("💻 Interactive Coding Lab & Practice", "In-browser code editor supporting JavaScript, TypeScript, Python, and SQL with instant execution, test runner, output terminal, and algorithmic problem sets."),
        ("🚀 Capstone Projects & Submissions", "Industry-grade projects requiring architecture design, GitHub repository submissions, live preview links, and rubric-based instructor grading."),
        ("🏆 Verifiable Certificates & Portfolio", "Automated certificate generation upon 100% course completion with unique verification hashes, LinkedIn sharing, and a personalized public student portfolio generator."),
        ("🤖 24/7 Floating AI Tutor (TYC Assistant)", "Interactive drawer equipped with four specialized AI modes: Code Debugger, Architecture Explainer, Quiz Master, and Career Mentor."),
        ("👥 Community, Workshops & Hackathons", "Collaborative forums, live workshop schedules, and hackathon registration portals fostering peer-to-peer developer collaboration.")
    ]

    for title, desc in modules_info:
        story.append(Paragraph(f"<b>{title}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 10))

    # ==================== SECTION 4 ====================
    story.append(Paragraph("4. Role-Based Access Control (RBAC) Matrix", h1_style))
    
    rbac_data = [
        [
            Paragraph("Role", table_header_style),
            Paragraph("Default User", table_header_style),
            Paragraph("Password", table_header_style),
            Paragraph("Clearance & Accessible Portals", table_header_style)
        ],
        [
            Paragraph("<b>Student</b>", table_bold_style),
            Paragraph("alex.rivera@tyc.dev", table_body_style),
            Paragraph("<code>alex@123</code>", table_body_style),
            Paragraph("Student Dashboard, Courses, Coding Lab, Practice, Portfolio", table_body_style)
        ],
        [
            Paragraph("<b>Student</b>", table_bold_style),
            Paragraph("priya.sharma@tyc.dev", table_body_style),
            Paragraph("<code>priya@123</code>", table_body_style),
            Paragraph("Student Dashboard, Cloud DevOps Tracks, Certificates", table_body_style)
        ],
        [
            Paragraph("<b>Instructor</b>", table_bold_style),
            Paragraph("sarah.chen@tyc.dev", table_body_style),
            Paragraph("<code>sarah@123</code>", table_body_style),
            Paragraph("Instructor Portal, Grading Submissions, Student Roster", table_body_style)
        ],
        [
            Paragraph("<b>Admin</b>", table_bold_style),
            Paragraph("admin@tyc.dev", table_body_style),
            Paragraph("<code>admin@123</code>", table_body_style),
            Paragraph("Admin Console, Course CMS, Student Manager, System Analytics", table_body_style)
        ],
        [
            Paragraph("<b>Owner (Creator)</b>", table_bold_style),
            Paragraph("owner@tyc.dev", table_body_style),
            Paragraph("<code>owner@123</code>", table_body_style),
            Paragraph("Unrestricted root clearance across all consoles & CMS features", table_body_style)
        ],
    ]

    rbac_table = Table(rbac_data, colWidths=[65, 125, 75, 239])
    rbac_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), brand_emerald),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(rbac_table)
    story.append(Spacer(1, 10))

    # ==================== SECTION 5 ====================
    story.append(Paragraph("5. Technical Architecture & Component Tree", h1_style))
    
    tech_data = [
        [Paragraph("Layer", table_header_style), Paragraph("Technology / Library", table_header_style), Paragraph("Architectural Purpose", table_header_style)],
        [Paragraph("<b>Core Framework</b>", table_bold_style), Paragraph("React 19 + TypeScript", table_body_style), Paragraph("Strict typing, concurrent rendering, modular UI chunks", table_body_style)],
        [Paragraph("<b>Build Tooling</b>", table_bold_style), Paragraph("Vite 8", table_body_style), Paragraph("Sub-second Hot Module Replacement (HMR) and optimized build chunks", table_body_style)],
        [Paragraph("<b>Styling & Theme</b>", table_bold_style), Paragraph("Tailwind CSS + CSS Tokens", table_body_style), Paragraph("High-contrast Dark/Light themes, responsive typography, glassmorphism", table_body_style)],
        [Paragraph("<b>Animation Engine</b>", table_bold_style), Paragraph("Framer Motion + Canvas Confetti", table_body_style), Paragraph("Smooth Mascot crossfades, route transitions, celebration particles", table_body_style)],
        [Paragraph("<b>Enterprise Auth</b>", table_bold_style), Paragraph("@clerk/react + LocalStorage RBAC", table_body_style), Paragraph("Multi-provider authentication, OAuth, secure session persistence", table_body_style)],
        [Paragraph("<b>State Contexts</b>", table_bold_style), Paragraph("Auth, LMS, Notifications, Theme", table_body_style), Paragraph("Decoupled global state management with zero external boilerplate", table_body_style)],
    ]
    tech_table = Table(tech_data, colWidths=[90, 160, 254])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), accent_blue),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 10))

    # ==================== SECTION 6 ====================
    story.append(Paragraph("6. Platform Verification & Running Instructions", h1_style))
    story.append(Paragraph("To access and test the entire platform locally:", body_style))
    story.append(Paragraph("1. <b>Start Server:</b> Run <code>npm run dev</code> or <code>vite</code> (Server runs at <code>http://localhost:5173/</code>).", bullet_style))
    story.append(Paragraph("2. <b>Access Login Gate:</b> Navigate to <code>http://localhost:5173/login</code> to experience the 6-phase mascot animation.", bullet_style))
    story.append(Paragraph("3. <b>Sign In:</b> Use any of the RBAC credentials above or 1-Click Google / Clerk Auth to unlock the dashboard.", bullet_style))
    story.append(Paragraph("4. <b>CMS & Admin Console:</b> Log in as <code>admin@tyc.dev</code> or <code>owner@tyc.dev</code> to manage courses, students, and submissions.", bullet_style))

    story.append(Spacer(1, 14))

    # Callout Box
    callout_data = [[
        Paragraph("<b>💡 Summary Statement:</b> Traya Yukti Core (TYC) LMS delivers an enterprise-grade, pedagogically sound, and visually engaging developer education ecosystem ready for real-world deployment.", callout_style)
    ]]
    callout_table = Table(callout_data, colWidths=[504])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ECFDF5")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#10B981")),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(callout_table)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    out_file = "Traya_Yukti_LMS_Complete_Overview.pdf"
    if len(sys.argv) > 1:
        out_file = sys.argv[1]
    build_pdf(out_file)
