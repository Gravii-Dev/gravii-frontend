from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT_PATH = Path("/Users/kxwxn/Gravii/FRONTEND/output/pdf/gravii-operations-priority-board.pdf")
FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
]


@dataclass(frozen=True)
class Row:
    area: str
    task: str
    reason: str
    deliverable: str


SECTIONS: list[tuple[str, str, colors.Color, list[Row]]] = [
    (
        "지금 꼭 할 것",
        "구조 개편 직후에 바로 점검해야 하는 운영 안정화 항목",
        colors.HexColor("#F97316"),
        [
            Row("도메인/배포", "모든 도메인 실접속 확인", "구조를 바꾼 직후라 실제 서비스가 정상 동작하는지 가장 먼저 확인해야 함", "접속 체크 완료"),
            Row("라우팅", "gravii.io, /partners, app, partner, admin 주요 CTA 확인", "버튼 하나 잘못 연결돼도 바로 사용자 이탈로 이어짐", "CTA 점검표"),
            Row("환경변수", "앱별 Vercel env 정리", "배포가 되어도 auth/API/env가 틀리면 실제 서비스는 동작하지 않음", "앱별 env 리스트"),
            Row("앱 상태 진단", "각 앱이 운영 가능 / mock / prototype 중 어디인지 분류", "지금은 구조만 정리됐고 실제 제품 준비 상태는 앱마다 다를 수 있음", "상태 진단표"),
            Row("목업 데이터", "하드코딩/더미 데이터 위치 파악", "API 연결 전에 mock 위치를 알아야 우선순위를 정할 수 있음", "mock data 인벤토리"),
            Row("API 연결 현황", "실제 API가 붙은 화면과 안 붙은 화면 구분", "제품화에서 가장 위험한 상태는 '겉은 되는데 데이터는 안 붙은 상태'임", "API 연결 현황표"),
            Row("인증 흐름", "user / partner / admin 로그인 진입 확인", "도메인 정리 후 auth redirect나 callback이 깨졌을 가능성이 있음", "auth 체크리스트"),
            Row("운영 문서", "도메인 ↔ 앱 ↔ Vercel 프로젝트 ↔ root directory 정리", "팀이 같은 그림을 봐야 이후 작업과 배포가 안 꼬임", "운영 문서 1장"),
        ],
    ),
    (
        "곧 해야 할 것",
        "제품화 속도를 올리기 위해 바로 뒤따라야 하는 정리 작업",
        colors.HexColor("#2563EB"),
        [
            Row("디자인 시스템", "공통 색상, 타입, 버튼, spacing, form 패턴 정리", "제품군이 늘어날수록 일관성 없는 UI는 유지보수 비용을 키움", "design tokens / base components"),
            Row("UI 공통화", "중복 버튼/카드/헤더/섹션 구조 정리", "앱마다 비슷한 UI를 따로 관리하면 수정 비용이 커짐", "shared UI 기준"),
            Row("mock 제거", "prototype 화면을 실제 제품 화면으로 전환", "제품 신뢰도와 개발 속도 모두에 직접 영향", "mock 제거 목록"),
            Row("데이터 모델 정리", "user / partner / admin에서 쓰는 타입/응답 구조 정리", "API 붙일 때 가장 자주 꼬이는 부분이라 선제 정리가 중요", "타입/계약 문서"),
            Row("에러/빈 상태", "loading, empty, error UX 추가", "실제 API를 붙이면 가장 먼저 드러나는 품질 문제", "공통 상태 처리"),
            Row("분석 이벤트", "CTA, signup, partner conversion 트래킹", "지금부터 수집해야 이후 판단과 개선이 가능함", "event map"),
            Row("SEO", "landing 메타/OG/canonical/robots 재점검", "이미 공개 도메인이라 검색/공유 품질이 중요함", "SEO 체크리스트"),
            Row("테스트", "최소 smoke / route / CTA 테스트", "배포 후 기본 동작을 보장하기 위한 최소 안전장치", "smoke test 세트"),
        ],
    ),
    (
        "나중에 해도 되는 것",
        "지금은 보류해도 되지만 안정화 이후 계획에 넣어둘 항목",
        colors.HexColor("#6B7280"),
        [
            Row("레거시 제거", "apps/gravii-partner-landing 삭제 여부 결정", "지금은 비교/백업용으로 남겨두는 편이 안전함", "제거 또는 보관 결정"),
            Row("예전 repo 정리", "gravii-landing-v2 등 archive/deprecate", "서비스가 새 구조로 안정화된 뒤 처리해도 됨", "repo 정리"),
            Row("성능 최적화", "landing animation/WebGPU/bundle 개선", "지금은 먼저 정확히 동작하는 것이 더 중요함", "성능 개선 리스트"),
            Row("컴포넌트 리팩토링", "큰 파일 분리, 폴더 구조 정교화", "급한 운영 이슈나 기능 이슈보다 후순위", "리팩토링 계획"),
            Row("브랜치 전략", "PR preview / release flow 정교화", "팀 운영 리듬이 정해진 뒤 다듬어도 충분함", "Git workflow 문서"),
            Row("staging 체계", "별도 staging 도메인/환경", "제품 운영 패턴이 고정된 뒤 확장 가능", "staging 설계"),
            Row("디자인 polish", "세밀한 motion, microcopy, visual tuning", "구조와 데이터가 먼저 안정되어야 효과가 큼", "polish backlog"),
        ],
    ),
]


def register_font() -> str:
    for candidate in FONT_CANDIDATES:
        path = Path(candidate)
        if path.exists():
            pdfmetrics.registerFont(TTFont("GraviiKorean", str(path)))
            return "GraviiKorean"
    raise FileNotFoundError("Korean-compatible font not found")


def build_styles(font_name: str) -> dict[str, ParagraphStyle]:
    styles = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=styles["Title"],
            fontName=font_name,
            fontSize=22,
            leading=28,
            textColor=colors.HexColor("#111827"),
            alignment=TA_LEFT,
            spaceAfter=4,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=styles["BodyText"],
            fontName=font_name,
            fontSize=9.5,
            leading=14,
            textColor=colors.HexColor("#4B5563"),
        ),
        "section_title": ParagraphStyle(
            "SectionTitle",
            parent=styles["Heading2"],
            fontName=font_name,
            fontSize=14,
            leading=18,
            textColor=colors.white,
        ),
        "section_desc": ParagraphStyle(
            "SectionDesc",
            parent=styles["BodyText"],
            fontName=font_name,
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#374151"),
        ),
        "cell": ParagraphStyle(
            "Cell",
            parent=styles["BodyText"],
            fontName=font_name,
            fontSize=8.6,
            leading=11.5,
            textColor=colors.HexColor("#111827"),
        ),
        "cell_bold": ParagraphStyle(
            "CellBold",
            parent=styles["BodyText"],
            fontName=font_name,
            fontSize=8.6,
            leading=11.5,
            textColor=colors.HexColor("#111827"),
        ),
        "small": ParagraphStyle(
            "Small",
            parent=styles["BodyText"],
            fontName=font_name,
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#6B7280"),
        ),
    }


def build_table(rows: list[Row], styles: dict[str, ParagraphStyle], accent: colors.Color) -> Table:
    header = [
        Paragraph("<b>영역</b>", styles["cell"]),
        Paragraph("<b>해야 할 일</b>", styles["cell"]),
        Paragraph("<b>왜 필요한지 / 왜 지금 중요한지</b>", styles["cell"]),
        Paragraph("<b>결과물</b>", styles["cell"]),
    ]
    data = [header]
    for row in rows:
        data.append(
            [
                Paragraph(f"<b>{row.area}</b>", styles["cell"]),
                Paragraph(row.task, styles["cell"]),
                Paragraph(row.reason, styles["cell"]),
                Paragraph(row.deliverable, styles["cell"]),
            ]
        )

    table = Table(
        data,
        colWidths=[26 * mm, 58 * mm, 74 * mm, 28 * mm],
        repeatRows=1,
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), accent),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#D1D5DB")),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
            ]
        )
    )
    return table


def draw_header_footer(canvas, doc) -> None:
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(colors.HexColor("#E5E7EB"))
    canvas.setLineWidth(0.6)
    canvas.line(18 * mm, height - 16 * mm, width - 18 * mm, height - 16 * mm)
    canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
    canvas.setFont("GraviiKorean", 8)
    canvas.setFillColor(colors.HexColor("#6B7280"))
    canvas.drawString(18 * mm, height - 12.5 * mm, "Gravii Frontend Operations Board")
    canvas.drawRightString(width - 18 * mm, 9.5 * mm, f"{doc.page}")
    canvas.restoreState()


def build_pdf() -> Path:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    font_name = register_font()
    styles = build_styles(font_name)

    doc = BaseDocTemplate(
        str(OUTPUT_PATH),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=22 * mm,
        bottomMargin=18 * mm,
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=draw_header_footer)])

    story = [
        Paragraph("Gravii 운영 우선순위 보드", styles["title"]),
        Paragraph(
            "도메인 구조 개편 이후의 운영 안정화, 제품화 준비, 후순위 백로그를 한 번에 공유할 수 있도록 정리한 실행 문서.",
            styles["subtitle"],
        ),
        Spacer(1, 5 * mm),
        Table(
            [
                [
                    Paragraph("<b>문서 목적</b><br/>도메인, 라우팅, 인증, 배포 상태를 빠르게 점검하고 다음 실행 순서를 팀 공통 기준으로 맞추기 위함", styles["section_desc"]),
                    Paragraph("<b>권장 사용 방식</b><br/>체크 완료 여부는 이 문서를 기준으로 운영 문서, CTA 점검표, env 리스트, auth 체크리스트로 이어서 확장", styles["section_desc"]),
                ]
            ],
            colWidths=[84 * mm, 84 * mm],
        ),
        Spacer(1, 6 * mm),
    ]

    for index, (title, desc, accent, rows) in enumerate(SECTIONS):
        section_label = Table(
            [[Paragraph(f"<b>{title}</b>", styles["section_title"])]],
            colWidths=[doc.width],
        )
        section_label.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), accent),
                    ("BOX", (0, 0), (-1, -1), 0, accent),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )
        story.extend(
            [
                section_label,
                Spacer(1, 2.8 * mm),
                Paragraph(desc, styles["section_desc"]),
                Spacer(1, 3.2 * mm),
                build_table(rows, styles, accent),
            ]
        )
        if index < len(SECTIONS) - 1:
            story.extend([Spacer(1, 6 * mm)])

    story.extend(
        [
            Spacer(1, 5 * mm),
            Paragraph(
                "정리 기준: '지금 꼭 할 것'은 실제 서비스 리스크를 바로 줄이는 항목, '곧 해야 할 것'은 제품화 속도를 높이는 기반 작업, '나중에 해도 되는 것'은 안정화 이후로 미뤄도 되는 개선 항목.",
                styles["small"],
            )
        ]
    )

    doc.build(story)
    return OUTPUT_PATH


if __name__ == "__main__":
    path = build_pdf()
    print(path)
