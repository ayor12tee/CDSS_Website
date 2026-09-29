// Initial website content. Used to seed Supabase (npm run db:seed) and as the
// read-only fallback when Supabase is not configured. After seeding, edit content in /admin.
import type { SiteSettings, Product, Industry, Partner, Client, Faq, Publication } from '@/lib/types';

export const seedSettings: SiteSettings = {
  "company": {
    "name": "CDSS (Nig.) Limited",
    "legal": "Computer Designs, Systems, Services (Nig.) Limited",
    "email": "info@cdss-nigeria.com",
    "phones": [
      "+234 807 685 7178",
      "+234 802 466 0112",
      "+234 816 281 0696"
    ],
    "address": "Plot 29, Shittu Animashaun Street, Gbagada Estate, Phase II, Gbagada, Lagos, Nigeria",
    "poBox": "P.O. Box 6415, Ikeja, Lagos",
    "locationShort": "Gbagada, Lagos"
  },
  "announcement": {
    "enabled": true,
    "label": "2025",
    "text": "Bentley's Top-Performing Partner in Sub-Saharan Africa",
    "href": "/publications/bentley-top-partner-africa-2025"
  },
  "hero": {
    "titleLead": "Powering industry through",
    "titleAccent": "technology.",
    "subtitle": "For over 35 years, CDSS has supplied Nigeria's engineering, industrial and public-sector organisations with world-class software, hardware, certified training and expert support, all from one accountable partner."
  },
  "otherLines": [
    "Hexagon PPM",
    "CYPE",
    "MasterSeries",
    "GTX",
    "ClearEdge3D",
    "InnoDraw",
    "HP DesignJet",
    "Getac"
  ]
};

export const seedProducts: Omit<Product, 'id'>[] = [
  {
    "slug": "autodesk",
    "name": "Autodesk",
    "group": "Software",
    "kind": "Design & Engineering",
    "tagline": "The world's design and make platform.",
    "lede": "Autodesk is the company behind AutoCAD, Revit, Civil 3D and Inventor — software used by millions of architects, engineers and manufacturers to design buildings, infrastructure and products. As an authorised Autodesk reseller, CDSS licenses, installs, trains and supports the full Autodesk AEC and manufacturing line-up for engineering offices across Nigeria.",
    "uses": [
      "Architectural design and documentation (Revit, AutoCAD)",
      "Civil infrastructure design (Civil 3D, InfraWorks)",
      "Structural and steel detailing (Advance Steel, Robot Structural Analysis)",
      "Manufacturing and product design (Inventor, Fusion)",
      "Construction coordination and clash detection (Navisworks)"
    ],
    "keyProducts": [
      "AutoCAD",
      "Revit",
      "Civil 3D",
      "InfraWorks",
      "Advance Steel",
      "Robot Structural Analysis",
      "Inventor",
      "Fusion",
      "Navisworks"
    ],
    "why": "CDSS has been an Autodesk reseller and training provider since AutoCAD's earliest days in Nigeria — including the country's first-ever AutoCAD installation, delivered for Chevron in 1992. Every licence we sell is genuine and vendor-backed, and comes with certified training and ongoing local support rather than a bare software key.",
    "industries": [
      "aec",
      "government-gis"
    ],
    "sortOrder": 0,
    "published": true
  },
  {
    "slug": "bentley",
    "name": "Bentley Systems",
    "group": "Software",
    "kind": "Infrastructure Engineering",
    "tagline": "Advancing the world's infrastructure.",
    "lede": "Bentley Systems builds the infrastructure engineering software behind MicroStation, STAAD.Pro, OpenRoads and the OpenPlant and AutoPIPE product families used across oil & gas, civil and structural engineering worldwide. Bentley has named CDSS its top-performing partner in Sub-Saharan Africa for 2025 — recognition built on more than three decades of licensing, training and support for Nigeria's Bentley users.",
    "uses": [
      "Piping stress analysis and pressure vessel design (AutoPIPE, AutoPIPE Vessel)",
      "Plant design and isometric drawing production (AutoPLANT, OpenPlant)",
      "Structural analysis and steel/concrete design (STAAD.Pro, ProSteel, ProConcrete)",
      "Offshore structural analysis (SACS)",
      "Reality modelling from photographs and laser scans (ContextCapture)",
      "Civil infrastructure design (OpenRoads, MicroStation)"
    ],
    "keyProducts": [
      "MicroStation",
      "STAAD.Pro",
      "AutoPIPE",
      "AutoPIPE Vessel",
      "AutoPLANT",
      "OpenPlant",
      "ProSteel",
      "ProConcrete",
      "SACS",
      "ContextCapture",
      "OpenRoads"
    ],
    "why": "CDSS has served primarily the oil & gas industry as a Bentley channel partner for many years — the relationship Bentley itself recognised with its 2025 Sub-Saharan Africa Top-Performing Partner award. That means genuine, vendor-backed licensing plus certified training and support from the same team that has supported Nigeria's Bentley users for decades.",
    "industries": [
      "oil-gas",
      "aec",
      "government-gis"
    ],
    "sortOrder": 1,
    "published": true
  },
  {
    "slug": "seequent",
    "name": "Seequent",
    "group": "Software",
    "kind": "Geoscience & Subsurface Modelling",
    "tagline": "Bringing certainty to the subsurface.",
    "lede": "Seequent, part of Bentley Systems, builds the geological and geotechnical modelling software used across mining, civil and environmental projects — including Leapfrog Geo, MX Deposit and Oasis montaj. CDSS brings Seequent's subsurface modelling tools to Nigeria's mining, survey and geoscience sector.",
    "uses": [
      "Geological and orebody modelling (Leapfrog Geo)",
      "Drillhole and sample data management (MX Deposit)",
      "Geophysical and geochemical data processing (Oasis montaj)",
      "Geotechnical and environmental site modelling (Leapfrog)"
    ],
    "keyProducts": [
      "Leapfrog Geo",
      "MX Deposit",
      "Oasis montaj"
    ],
    "why": "As part of the Bentley family, Seequent fits naturally alongside CDSS's long-standing Bentley relationship and engineering-office client base. CDSS pairs Seequent's subsurface modelling tools with its broader civil, structural, survey and document-management capabilities — useful for any mining or geoscience operation that needs more than one piece of the puzzle.",
    "industries": [
      "mining-geoscience",
      "government-gis"
    ],
    "sortOrder": 2,
    "published": true
  },
  {
    "slug": "ansys",
    "name": "ANSYS",
    "group": "Software",
    "kind": "Engineering Simulation",
    "tagline": "Simulate what matters, before you build it.",
    "lede": "ANSYS is the industry standard for engineering simulation, letting teams test how a design will perform — structurally, thermally or in a fluid flow — before it is ever built. CDSS licenses and supports ANSYS's multiphysics simulation tools for Nigerian engineering teams who need to validate a design before committing to it.",
    "uses": [
      "Structural mechanics and stress analysis (Mechanical)",
      "Heat transfer and thermal simulation (Thermal)",
      "Fluid flow and CFD analysis (Fluids)",
      "Coupled multiphysics simulation (Multiphysics)"
    ],
    "keyProducts": [
      "Structural",
      "Thermal",
      "Fluids / CFD",
      "Multiphysics"
    ],
    "why": "CDSS pairs ANSYS licensing with the same certified training and technical support model used across its whole software line-up, so simulation isn't a standalone tool bought in isolation — it sits alongside the design and analysis software your team already uses.",
    "industries": [
      "oil-gas",
      "aec"
    ],
    "sortOrder": 3,
    "published": true
  },
  {
    "slug": "technical-toolboxes",
    "name": "Technical Toolboxes",
    "group": "Software",
    "kind": "Pipeline Engineering",
    "tagline": "Pipeline expertise you can rely on.",
    "lede": "Technical Toolboxes builds specialised engineering software and training for the pipeline industry, covering integrity assessment, corrosion evaluation and pipeline design calculations used by oil & gas operators worldwide. CDSS brings Technical Toolboxes' pipeline engineering tools to Nigeria's upstream and midstream oil & gas sector.",
    "uses": [
      "Pipeline integrity and fitness-for-service assessment (Integrity)",
      "Corrosion evaluation and remaining-life calculations (Corrosion)",
      "Pipeline design and engineering standardisation (Design)",
      "Industry-standard pipeline engineering training (Training)"
    ],
    "keyProducts": [
      "Integrity assessment",
      "Corrosion evaluation",
      "Design calculations",
      "Pipeline training"
    ],
    "why": "Pipeline integrity software is a natural extension of CDSS's long-standing oil & gas client base — the same engineering offices already using CDSS for design and structural software often need pipeline-specific tools too, and CDSS can support both from one relationship.",
    "industries": [
      "oil-gas"
    ],
    "sortOrder": 4,
    "published": true
  },
  {
    "slug": "contex",
    "name": "Contex",
    "group": "Hardware",
    "kind": "Large-Format Scanning",
    "tagline": "The market leader in large-format scanning.",
    "lede": "Contex is a Danish manufacturer of large-format scanners used to digitise engineering drawings, maps and archives — trusted by engineering offices in over 100 countries. CDSS supplies and supports Contex scanners in 24″, 36″, 42″, 44″ and 60″ widths, and uses them in its own bureau services to convert paper drawings into usable digital and CAD-ready files.",
    "uses": [
      "Digitising engineering and CAD drawings (Monochrome & colour)",
      "Archiving maps, plans and technical documents (Up to 60″ wide)",
      "Scanning artwork, books and oversized documents (Unlimited length)",
      "Feeding raster-to-vector conversion workflows (GTX, Autodesk Raster Design)"
    ],
    "keyProducts": [
      "24″ scanners",
      "36″ scanners",
      "42″ scanners",
      "44″ scanners",
      "60″ scanners"
    ],
    "why": "CDSS doesn't just sell the scanner — it runs the full bureau-services workflow around it, turning scanned paper drawings back into live, editable CAD files via GTX RasterCAD/ImageCAD and Autodesk Raster Design, which is where a scanner alone stops being useful.",
    "industries": [
      "government-gis",
      "aec"
    ],
    "sortOrder": 5,
    "published": true
  },
  {
    "slug": "avision",
    "name": "Avision",
    "group": "Hardware",
    "kind": "Document Scanning",
    "tagline": "Quality, high-performance document scanning.",
    "lede": "Avision designs and manufactures document scanners and imaging components used across offices worldwide. CDSS supplies Avision's A3/A4 document scanning hardware to complement its large-format Contex line, covering everyday office document digitisation alongside engineering drawing archives.",
    "uses": [
      "Everyday office document scanning and digitisation (A4)",
      "Large-page records and drawing sets (A3)",
      "Batch scanning for records and administrative archives (Batch)"
    ],
    "keyProducts": [
      "A4 document scanners",
      "A3 document scanners"
    ],
    "why": "Avision's document scanners round out CDSS's hardware line-up alongside Contex's large-format scanners, so an engineering office can source both everyday document scanning and large-format drawing capture from the same partner.",
    "industries": [
      "government-gis"
    ],
    "sortOrder": 6,
    "published": true
  }
];

export const seedIndustries: Omit<Industry, 'id'>[] = [
  {
    "slug": "oil-gas",
    "name": "Oil & Gas",
    "short": "Upstream, midstream & offshore",
    "image": "industry-oil-gas",
    "icon": "flame",
    "title": "Engineering software for oil & gas — from the jacket to the pipeline.",
    "lede": "Nigeria's first AutoCAD workstation was installed for an oil major, and the oil & gas sector has been at the centre of CDSS's work ever since. We equip upstream, midstream and offshore engineering teams with the design, analysis and integrity tools the industry runs on — and the training and support to use them well.",
    "summary": "Piping, plant, offshore structures and pipeline integrity — the tools upstream and offshore teams run on.",
    "capabilities": [
      {
        "icon": "layers",
        "title": "Plant & piping design",
        "text": "Plant layout, piping design and isometric drawing production with AutoPLANT and OpenPlant."
      },
      {
        "icon": "activity",
        "title": "Stress & vessel analysis",
        "text": "Piping stress analysis and pressure vessel design with AutoPIPE and AutoPIPE Vessel."
      },
      {
        "icon": "building",
        "title": "Offshore structures",
        "text": "Offshore structural analysis of jackets and topsides with SACS, alongside STAAD.Pro."
      },
      {
        "icon": "shield",
        "title": "Pipeline integrity",
        "text": "Fitness-for-service, corrosion evaluation and remaining-life calculations with Technical Toolboxes."
      },
      {
        "icon": "cpu",
        "title": "Simulation",
        "text": "Structural, thermal and CFD simulation of critical equipment with ANSYS."
      },
      {
        "icon": "file",
        "title": "Drawing archives",
        "text": "Scanning and raster-to-vector conversion of legacy facility drawings through our bureau services."
      }
    ],
    "solutions": [
      "bentley",
      "technical-toolboxes",
      "ansys",
      "autodesk"
    ],
    "clients": [
      "Chevron",
      "ExxonMobil",
      "Nigeria LNG Limited",
      "Nigerian Agip Oil Company (NAOC)",
      "Addax Petroleum",
      "Nestoil",
      "KOA Oil & Gas Limited",
      "Deltatek Offshore"
    ],
    "articles": [
      "pipeline-integrity-software-upstream",
      "bentley-top-partner-africa-2025",
      "simulation-before-construction"
    ],
    "sortOrder": 0,
    "published": true
  },
  {
    "slug": "aec",
    "name": "Architecture, Engineering & Construction",
    "short": "Buildings, structures & infrastructure",
    "image": "industry-aec",
    "icon": "building",
    "title": "Design, analyse and coordinate buildings and infrastructure with confidence.",
    "lede": "Architects, consulting engineers and contractors rely on CDSS for the design and BIM tools that turn concepts into coordinated, buildable projects — along with certified training to move teams from 2D CAD to BIM without stalling live work.",
    "summary": "BIM, structural design and construction coordination for architects, consultants and contractors.",
    "capabilities": [
      {
        "icon": "box",
        "title": "BIM & architectural design",
        "text": "Model-based design and documentation with Revit and AutoCAD, supported by our CAD-to-BIM transition programme."
      },
      {
        "icon": "building",
        "title": "Structural design",
        "text": "Analysis and design of steel and concrete structures with STAAD.Pro, Robot, MasterSeries and CYPE."
      },
      {
        "icon": "layers",
        "title": "Detailing",
        "text": "Steel detailing with Advance Steel and ProSteel; rebar detailing with InnoDraw."
      },
      {
        "icon": "map",
        "title": "Civil & infrastructure",
        "text": "Roads, drainage and site design with Civil 3D, InfraWorks and OpenRoads."
      },
      {
        "icon": "scan",
        "title": "Coordination",
        "text": "Clash detection and construction coordination with Navisworks."
      },
      {
        "icon": "printer",
        "title": "Plotting & scanning",
        "text": "HP DesignJet plotters and Contex scanners for drawing production and archives."
      }
    ],
    "solutions": [
      "autodesk",
      "bentley",
      "ansys",
      "contex"
    ],
    "clients": [
      "ECAD Architects",
      "BOM Associates",
      "Dover Engineering",
      "TSL Engineering Limited",
      "Delta Afrik Engineering",
      "UF-A Consultants",
      "CresTech",
      "IMPaC Engineering"
    ],
    "articles": [
      "cad-to-bim-transition-guide",
      "simulation-before-construction",
      "thirty-five-years-of-cad-in-nigeria"
    ],
    "sortOrder": 1,
    "published": true
  },
  {
    "slug": "government-gis",
    "name": "Government, Survey & GIS",
    "short": "Mapping, land & public records",
    "image": "industry-gis",
    "icon": "map",
    "title": "Mapping, survey and records technology for the public sector.",
    "lede": "Government agencies and survey organisations use CDSS to capture, map and preserve the information public infrastructure depends on — from reality modelling and civil design to scanning and digitising decades of paper maps and plans.",
    "summary": "Mapping, reality modelling and archive digitisation for agencies and survey organisations.",
    "capabilities": [
      {
        "icon": "map",
        "title": "Mapping & GIS",
        "text": "Mapping, survey and geospatial drafting with MicroStation, Civil 3D and InfraWorks."
      },
      {
        "icon": "scan",
        "title": "Reality modelling",
        "text": "Accurate 3D models from photographs and laser scans with ContextCapture and ClearEdge3D."
      },
      {
        "icon": "file",
        "title": "Map & plan digitisation",
        "text": "Large-format scanning of maps and plans up to 60″ wide with Contex scanners."
      },
      {
        "icon": "layers",
        "title": "Raster-to-vector",
        "text": "Converting scanned maps into editable CAD with GTX RasterCAD and ImageCAD."
      },
      {
        "icon": "shield",
        "title": "Records management",
        "text": "Secure indexing, storage and retrieval of digitised records with FileHold."
      },
      {
        "icon": "users",
        "title": "Engineering services",
        "text": "Drafting and mapping support for GIS clients on a man-hour basis."
      }
    ],
    "solutions": [
      "bentley",
      "autodesk",
      "contex",
      "avision"
    ],
    "clients": [
      "Kaduna Geographic Information Service (KADGIS)",
      "National Steel Raw Materials Exploration Agency"
    ],
    "articles": [
      "digitising-paper-drawing-archives",
      "thirty-five-years-of-cad-in-nigeria"
    ],
    "sortOrder": 2,
    "published": true
  },
  {
    "slug": "mining-geoscience",
    "name": "Mining & Geoscience",
    "short": "Exploration & subsurface modelling",
    "image": "industry-mining",
    "icon": "mountain",
    "title": "Subsurface certainty for mining and geoscience teams.",
    "lede": "From exploration data to 3D geological models, CDSS brings Seequent's geoscience software to Nigeria's mining and geoscience sector — backed by the same certified training and local support model we have run for more than three decades.",
    "summary": "Geological modelling, drillhole data and geophysics for exploration and mining.",
    "capabilities": [
      {
        "icon": "mountain",
        "title": "Geological modelling",
        "text": "Implicit 3D geological and orebody modelling with Leapfrog Geo."
      },
      {
        "icon": "layers",
        "title": "Drillhole data",
        "text": "Managing drillhole, sample and QA/QC data with MX Deposit."
      },
      {
        "icon": "activity",
        "title": "Geophysics",
        "text": "Processing and interpreting geophysical and geochemical data with Oasis montaj."
      },
      {
        "icon": "building",
        "title": "Geotechnical",
        "text": "Geotechnical and environmental site models for civil and mining projects."
      },
      {
        "icon": "map",
        "title": "Survey integration",
        "text": "Combining subsurface models with survey and civil design data in Bentley and Autodesk tools."
      },
      {
        "icon": "file",
        "title": "Map archives",
        "text": "Digitising historical geological maps and sections through our bureau services."
      }
    ],
    "solutions": [
      "seequent",
      "bentley",
      "contex"
    ],
    "clients": [
      "National Steel Raw Materials Exploration Agency (Federal Ministry of Mines & Steel Development)"
    ],
    "articles": [
      "thirty-five-years-of-cad-in-nigeria",
      "digitising-paper-drawing-archives"
    ],
    "sortOrder": 3,
    "published": true
  }
];

export const seedPartners: Omit<Partner, 'id'>[] = [
  {
    "name": "Autodesk",
    "tag": "Software Partner",
    "description": "AutoCAD, Revit, Civil 3D and the wider AEC and manufacturing line-up.",
    "productSlug": "autodesk",
    "sortOrder": 0
  },
  {
    "name": "Bentley Systems",
    "tag": "Software Partner",
    "description": "MicroStation, STAAD.Pro, OpenRoads and the OpenPlant/AutoPIPE families — CDSS is Bentley's top-performing partner in Sub-Saharan Africa, 2025.",
    "productSlug": "bentley",
    "sortOrder": 1
  },
  {
    "name": "Seequent",
    "tag": "Software Partner",
    "description": "Leapfrog Geo, MX Deposit and Oasis montaj for geological and geotechnical modelling.",
    "productSlug": "seequent",
    "sortOrder": 2
  },
  {
    "name": "ANSYS",
    "tag": "Software Partner",
    "description": "Multiphysics engineering simulation — structural, thermal and fluid flow.",
    "productSlug": "ansys",
    "sortOrder": 3
  },
  {
    "name": "Technical Toolboxes",
    "tag": "Software Partner",
    "description": "Pipeline integrity, corrosion evaluation and design calculation software.",
    "productSlug": "technical-toolboxes",
    "sortOrder": 4
  },
  {
    "name": "Contex",
    "tag": "Hardware Partner",
    "description": "Large-format scanners for engineering drawings, maps and archives.",
    "productSlug": "contex",
    "sortOrder": 5
  },
  {
    "name": "Avision",
    "tag": "Hardware Partner",
    "description": "A3/A4 document scanners for everyday office digitisation.",
    "productSlug": "avision",
    "sortOrder": 6
  },
  {
    "name": "MasterSeries",
    "tag": "Software Partner",
    "description": "Structural analysis and design software used across building and civil engineering.",
    "productSlug": null,
    "sortOrder": 7
  },
  {
    "name": "CYPE",
    "tag": "Software Partner",
    "description": "BIM-integrated structural, MEP and architectural design software.",
    "productSlug": null,
    "sortOrder": 8
  },
  {
    "name": "Hexagon PPM",
    "tag": "Software Partner",
    "description": "Plant, process and marine design and engineering software.",
    "productSlug": null,
    "sortOrder": 9
  },
  {
    "name": "GTX",
    "tag": "Software Partner",
    "description": "RasterCAD and ImageCAD — intelligent paper-to-CAD raster editing and conversion.",
    "productSlug": null,
    "sortOrder": 10
  },
  {
    "name": "ClearEdge3D",
    "tag": "Software Partner",
    "description": "Point-cloud registration and BIM verification software for reality-capture workflows.",
    "productSlug": null,
    "sortOrder": 11
  },
  {
    "name": "InnoDraw",
    "tag": "Software Partner",
    "description": "Reinforcement and rebar detailing software for structural engineers.",
    "productSlug": null,
    "sortOrder": 12
  },
  {
    "name": "VSee",
    "tag": "Software Partner",
    "description": "Telehealth and virtual-care platform software, supplied and supported by CDSS.",
    "productSlug": null,
    "sortOrder": 13
  },
  {
    "name": "Bentley Institute",
    "tag": "Training Partner",
    "description": "Bentley's official product training curriculum, delivered by CDSS as a certified training partner.",
    "productSlug": null,
    "sortOrder": 14
  },
  {
    "name": "Zigurat Global Institute of Technology",
    "tag": "Education Partner",
    "description": "Postgraduate engineering and technology education, offered in partnership with CDSS.",
    "productSlug": null,
    "sortOrder": 15
  },
  {
    "name": "BeyondWare",
    "tag": "Technology Partner",
    "description": "Specialist technology solutions, supplied and supported by CDSS.",
    "productSlug": null,
    "sortOrder": 16
  }
];

export const seedClients: Omit<Client, 'id'>[] = [
  {
    "name": "Addax Petroleum",
    "group": "Oil & Gas",
    "onLogoWall": true,
    "sortOrder": 0
  },
  {
    "name": "ExxonMobil",
    "group": "Oil & Gas",
    "onLogoWall": true,
    "sortOrder": 1
  },
  {
    "name": "Chevron",
    "group": "Oil & Gas",
    "onLogoWall": true,
    "sortOrder": 2
  },
  {
    "name": "Nigeria LNG Limited",
    "group": "Oil & Gas",
    "onLogoWall": false,
    "sortOrder": 3
  },
  {
    "name": "Nigerian Agip Oil Company (NAOC)",
    "group": "Oil & Gas",
    "onLogoWall": false,
    "sortOrder": 4
  },
  {
    "name": "Nestoil",
    "group": "Oil & Gas",
    "onLogoWall": false,
    "sortOrder": 5
  },
  {
    "name": "KOA Oil & Gas Limited",
    "group": "Oil & Gas",
    "onLogoWall": false,
    "sortOrder": 6
  },
  {
    "name": "CresTech",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 7
  },
  {
    "name": "Dover Engineering",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 8
  },
  {
    "name": "Delta Afrik Engineering",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 9
  },
  {
    "name": "TSL Engineering Limited",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 10
  },
  {
    "name": "NETCO (National Engineering & Technical Company)",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 11
  },
  {
    "name": "Makon Engineering & Technical Services",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 12
  },
  {
    "name": "IMPaC Engineering",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 13
  },
  {
    "name": "Nexant Consulting",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 14
  },
  {
    "name": "UF-A Consultants",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 15
  },
  {
    "name": "BOM Associates",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 16
  },
  {
    "name": "Natview Technology",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 17
  },
  {
    "name": "Deltatek Offshore",
    "group": "Engineering & Consultancy",
    "onLogoWall": false,
    "sortOrder": 18
  },
  {
    "name": "Kaduna Geographic Information Service (KADGIS)",
    "group": "Government & Public Sector",
    "onLogoWall": false,
    "sortOrder": 19
  },
  {
    "name": "National Steel Raw Materials Exploration Agency (Federal Ministry of Mines & Steel Development)",
    "group": "Government & Public Sector",
    "onLogoWall": false,
    "sortOrder": 20
  },
  {
    "name": "BQUBE IT Solutions Nigeria Limited",
    "group": "Technology & Other",
    "onLogoWall": false,
    "sortOrder": 21
  },
  {
    "name": "Compact Manifold and Energy Services (CMES)",
    "group": "Technology & Other",
    "onLogoWall": false,
    "sortOrder": 22
  },
  {
    "name": "ECAD Architects",
    "group": "Technology & Other",
    "onLogoWall": false,
    "sortOrder": 23
  },
  {
    "name": "Nexus",
    "group": "Technology & Other",
    "onLogoWall": false,
    "sortOrder": 24
  },
  {
    "name": "Shell (SPDC)",
    "group": null,
    "onLogoWall": true,
    "sortOrder": 25
  },
  {
    "name": "Nigeria LNG",
    "group": null,
    "onLogoWall": true,
    "sortOrder": 26
  },
  {
    "name": "NAOC",
    "group": null,
    "onLogoWall": true,
    "sortOrder": 27
  },
  {
    "name": "NETCO",
    "group": null,
    "onLogoWall": true,
    "sortOrder": 28
  },
  {
    "name": "Ove Arup & Partners",
    "group": null,
    "onLogoWall": true,
    "sortOrder": 29
  },
  {
    "name": "Design Group Nigeria",
    "group": null,
    "onLogoWall": true,
    "sortOrder": 30
  },
  {
    "name": "University of Lagos",
    "group": null,
    "onLogoWall": true,
    "sortOrder": 31
  },
  {
    "name": "KADGIS",
    "group": null,
    "onLogoWall": true,
    "sortOrder": 32
  },
  {
    "name": "Lagos State Water Corp.",
    "group": null,
    "onLogoWall": true,
    "sortOrder": 33
  }
];

export const seedFaqs: Omit<Faq, 'id'>[] = [
  {
    "section": "home",
    "question": "Are the software products you sell genuine and licensed?",
    "answer": "Yes. CDSS is an authorised reseller or partner for every vendor line we carry, including Autodesk, Bentley, Seequent, ANSYS and Technical Toolboxes. Every licence is genuine and backed by the vendor.",
    "sortOrder": 0
  },
  {
    "section": "home",
    "question": "How can I purchase software from CDSS?",
    "answer": "Contact us through the website, by phone or by email. We'll look at your workflow and team size, then send a formal quote.",
    "sortOrder": 1
  },
  {
    "section": "home",
    "question": "Do you offer volume licensing for businesses?",
    "answer": "Yes. Multi-seat and enterprise licensing is available. Get in touch to discuss terms for your team size.",
    "sortOrder": 2
  },
  {
    "section": "home",
    "question": "Do you offer training and certification?",
    "answer": "Yes. We offer certified training across every product line we carry, in person or online, including our CAD-to-BIM transition programme.",
    "sortOrder": 3
  },
  {
    "section": "home",
    "question": "What support do I get after purchase?",
    "answer": "Every client is covered by one of our three support plans, ranging from unlimited phone and email support to scheduled on-site visits. Remote diagnosis via AnyDesk is also included.",
    "sortOrder": 4
  },
  {
    "section": "training",
    "question": "Is training available online?",
    "answer": "Yes. Courses run in person at our Lagos training facility or live online via Zoom and Microsoft Teams, with certified instructors either way.",
    "sortOrder": 5
  },
  {
    "section": "training",
    "question": "Do you offer certified training?",
    "answer": "Yes. We offer certified training tracks across our product lines, including delivery as a Bentley Institute training partner.",
    "sortOrder": 6
  },
  {
    "section": "training",
    "question": "Can you train a whole team at once?",
    "answer": "Yes. Corporate training is available for teams, alongside personal training for individuals. Contact us to plan dates and content.",
    "sortOrder": 7
  },
  {
    "section": "training",
    "question": "What does a support contract cover?",
    "answer": "Annual support contracts cover installation, commissioning and application support, with the level of on-site cover set by your chosen tier.",
    "sortOrder": 8
  },
  {
    "section": "training",
    "question": "How quickly can you help with an urgent issue?",
    "answer": "Remote diagnosis via AnyDesk lets our engineers look at most issues straight away, without waiting for a site visit.",
    "sortOrder": 9
  }
];

export const seedPublications: Omit<Publication, 'id' | 'readTime' | 'updatedAt'>[] = [
  {
    "slug": "bentley-top-partner-africa-2025",
    "category": "news",
    "featured": true,
    "cover": "award",
    "title": "CDSS named Bentley Systems' Top-Performing Partner in Sub-Saharan Africa for 2025",
    "excerpt": "Bentley Systems has recognised CDSS as its top-performing partner in the Sub-Saharan Africa region for 2025 — a milestone built on decades of licensing, training and support for Nigeria's infrastructure engineers.",
    "tags": [
      "Bentley Systems",
      "Awards",
      "Oil & Gas"
    ],
    "products": [
      "bentley"
    ],
    "status": "published",
    "body": "Bentley Systems has named CDSS its top-performing partner in the Sub-Saharan Africa region for 2025. The recognition reflects a partnership that spans many years and much of Nigeria's oil & gas engineering community.\n\n> “Bentley Systems is proud to recognize CDSS as the top-performing partner in the Sub-Saharan Africa region for 2025. CDSS has been a trusted Bentley partner for many years, serving primarily the oil and gas industry.”\n>\n> — Allan Murphy, Senior Vice President, Bentley Systems\n\n## What the recognition reflects\n\nCDSS has worked with Bentley as a channel partner for many years, bringing its infrastructure engineering software to design offices, operators and consultants across Nigeria. Much of that work has been in oil & gas, where Bentley's plant, piping and offshore tools are part of everyday engineering.\n\n- **Plant and piping:** AutoPLANT and OpenPlant for plant design and isometric drawing production.\n- **Stress and vessels:** AutoPIPE and AutoPIPE Vessel for piping stress analysis and pressure vessel design.\n- **Structures:** STAAD.Pro, ProSteel and ProConcrete for structural analysis and design, and SACS for offshore structures.\n- **Infrastructure and reality modelling:** MicroStation, OpenRoads and ContextCapture.\n\nSales alone don't make a strong partnership. We deliver certified training as a Bentley Institute training partner, and we support clients locally, both on-site and remotely. That keeps licences in productive use long after they are bought.\n\n## What it means for our clients\n\nFor organisations that already run Bentley software with CDSS, the award confirms that they are working with a partner Bentley itself rates highly. In practice, that means:\n\n- Genuine, vendor-backed licensing, with access to current releases and licensing options.\n- Certified training for new starters and experienced users, in person at our Lagos facility or online via Zoom and Microsoft Teams.\n- Local technical support from engineers who know both the software and the projects it is used on.\n- One accountable partner across Bentley and the other vendor lines engineering offices typically need, including Autodesk, Seequent, ANSYS and Technical Toolboxes.\n\n## Looking ahead\n\nWe see the award as a reason to keep raising the standard, not to rest on it. Our focus stays on what has served clients since 1989: recommending the right tools for the job, training the people who use them, and being there when something needs fixing.\n\nWe would like to thank our clients for their continued trust, and the Bentley Systems team for their partnership and recognition.\n\n:::callout{icon=award title=\"Working with Bentley software?\"}\nTalk to our Bentley team about licensing, upgrades, training or support. [Speak to an expert](/contact).\n:::\n",
    "publishedOn": "2026-02-10"
  },
  {
    "slug": "thirty-five-years-of-cad-in-nigeria",
    "category": "insights",
    "cover": "history",
    "title": "35 years of CAD in Nigeria: from the first AutoCAD workstation to connected engineering",
    "excerpt": "CDSS was Nigeria's first CADD-specific technology company. Here is how three and a half decades of engineering technology have changed, and what has stayed the same.",
    "tags": [
      "Company",
      "Autodesk",
      "History"
    ],
    "products": [
      "autodesk",
      "bentley"
    ],
    "status": "published",
    "body": "In 1989, most engineering drawings in Nigeria were still produced by hand. That year, a registered civil engineer set up a company to change it. Thirty-five years later, CDSS is still doing that work. The tools have changed a great deal; the mission has not.\n\n:::facts\n- **1989** CDSS incorporated in Lagos as Nigeria's first CADD-specific technology company\n- **1992** Nigeria's first AutoCAD installation, delivered for Chevron\n- **2025** Named Bentley's top-performing partner in Sub-Saharan Africa\n:::\n\n## 1989: a company built around CADD\n\nEng. Peter A. O. Fisher founded CDSS as a company dedicated to computer-aided design and drafting (CADD). It was the first of its kind in Nigeria. The company was incorporated in June 1989 and became an authorised AutoCAD reseller for Nigeria that December.\n\nBecause the founder was an engineer, he understood what design offices actually needed. They didn't just need software. They needed reliable systems, people trained to use them properly, and support they could count on when deadlines were close. That thinking still shapes how CDSS works today.\n\n## 1992: Nigeria's first AutoCAD installation\n\nIn 1992, CDSS installed Nigeria's first AutoCAD workstation, for Chevron. It was an early sign of how quickly computer-aided design would become the standard way to produce drawings, first in oil & gas and then across architecture, engineering and construction.\n\n## Growing into a multi-vendor partner\n\nAs the industry's needs grew, so did the portfolio. Today CDSS is an authorised partner for a broad range of software and hardware vendors, including:\n\n- **Design and engineering:** Autodesk, Bentley Systems, CYPE, MasterSeries, Hexagon PPM and InnoDraw.\n- **Simulation and integrity:** ANSYS and Technical Toolboxes.\n- **Geoscience:** Seequent.\n- **Capture and conversion:** Contex, Avision, GTX and ClearEdge3D.\n\nOffering all of this through one partner means an engineering office can source design, analysis, scanning and archiving through a single relationship. It no longer has to manage five separate suppliers.\n\n## What hasn't changed\n\nEvery product line CDSS carries still comes with certified training and tiered technical support, not just a licence key. We run training from a dedicated in-house facility and online, and our support covers installation, commissioning and application support, with remote diagnosis when a site visit isn't needed.\n\nThe same values still guide the business: integrity in every client relationship, and partnership rather than one-off transactions. We also keep looking for technologies ahead of the market and bring them in together with the skills to use them.\n\n## The next chapter\n\nThe next stage of engineering technology is about connection. Design models feed simulation. Laser scans and photographs become reality models. Paper archives become searchable digital records. 2D CAD standards turn into shared BIM workflows. Through partnerships built over three decades, CDSS now works with clients well beyond Nigeria, in Kenya, Zambia, Angola, South Africa, Ghana and Côte d'Ivoire.\n\nWe will keep following the same approach that got us here: the right tools, properly taught and properly supported.\n",
    "featured": false,
    "publishedOn": "2026-03-18"
  },
  {
    "slug": "digitising-paper-drawing-archives",
    "category": "guides",
    "cover": "archive",
    "title": "How to protect a paper drawing archive: a practical guide to scanning and raster-to-vector conversion",
    "excerpt": "Decades of drawings, maps and plans can be lost to one fire, flood or leaking roof. Here is a step-by-step approach to digitising an archive, from surveying the sheets to retrieving them years later.",
    "tags": [
      "Bureau Services",
      "Contex",
      "Document Management"
    ],
    "products": [
      "contex",
      "avision"
    ],
    "status": "published",
    "body": "Many organisations hold thousands of paper drawings, from A3 sheets to A0+ plans and maps. Together they record how facilities, buildings and infrastructure were actually built. One fire, flood or leaking roof can destroy them, and so can decades of handling. Digitising the archive protects it, and it also makes the information much easier to use.\n\n## Why paper archives are at risk\n\nPaper archives usually decline slowly and without anyone noticing. Sheets tear along their folds. Diazo prints fade. Drawings are borrowed and never returned. Sometimes the only person who knows where a drawing is filed retires. When a drawing is finally needed for a modification, an inspection or a dispute, it may be damaged or missing.\n\nA digital archive removes most of these risks. Scanned drawings can be copied, backed up, searched and shared without the original ever leaving storage.\n\n## Step 1: Survey and prioritise\n\nBefore any scanning begins, find out what you have:\n\n- **Volume and sizes:** roughly how many sheets there are in each size, from A4 and A3 up to A0 and oversized rolls.\n- **Condition:** fragile, torn or taped sheets need careful handling and may call for a different scanner or feed.\n- **Content type:** black-and-white line drawings, colour maps, and marked-up or annotated prints.\n- **Business value:** which drawings describe live assets that will be modified or inspected. Scan these first.\n\n## Step 2: Scan at the right settings\n\nLarge-format scanners such as Contex capture sheets up to 44″ and 60″ wide at unlimited length, in monochrome or colour. A few settings make a big difference to the result:\n\n- **Colour mode:** monochrome or greyscale suits most line drawings and keeps files small. Use colour for maps, coloured markups and anything where colour carries meaning.\n- **Resolution:** for engineering line drawings, 300 to 400 dpi is a common choice. Very fine detail or small text may need more.\n- **Clean-up:** deskewing, despeckling and background removal make scans easier to read and give better results if the drawing is later converted to CAD.\n- **File format:** multi-page TIFF or PDF are common archive formats. Agree on one standard at the start and keep to it.\n\nAvision A3/A4 document scanners handle the smaller documents that usually sit next to the drawings, such as specifications, letters and data sheets.\n\n## Step 3: Decide what needs to become CAD\n\nNot every drawing needs converting to vector. A scanned image is enough for reference. But drawings of assets that will be modified are worth converting to editable CAD.\n\n- **Raster editing:** tools such as GTX RasterCAD and Autodesk Raster Design let you edit the scanned image directly, which is useful for quick revisions.\n- **Raster-to-vector conversion:** GTX ImageCAD and similar tools turn raster linework into CAD entities that can be used in AutoCAD or MicroStation.\n- **Hybrid drawings:** keeping the scan as a background underlay and redrawing only the areas that change is often the most cost-effective option.\n\n## Step 4: Index, store and retrieve\n\nA digital archive is only useful if people can find things in it. Set naming conventions and metadata early, including drawing number, title, revision, facility and discipline. Store files in a managed location with backups. A document management system such as FileHold adds search, version control and access permissions, so the right people can find the right drawing quickly.\n\nFor storage, choose whatever suits your IT environment: a network storage location (NAS), external drives, or optical media for offline copies. For important records, keep more than one copy, in more than one place.\n\n## In-house or bureau service?\n\nThere are two ways to run a digitisation project:\n\n1. **In-house:** CDSS supplies, installs and supports the scanners and software on your premises, and trains your staff to run them. This suits organisations with ongoing scanning needs or drawings that must not leave site.\n2. **Managed bureau service:** CDSS scans, converts and archives the drawings for you, using Contex scanners, HP DesignJet plotters and GTX conversion software. This suits one-off backlogs, or teams without the capacity to do the work themselves.\n\n:::callout{icon=file title=\"Get an appraisal of your archive\"}\nTell us roughly what you hold, and we will recommend the right approach, in-house or managed. [Explore bureau services](/about/bureau-services).\n:::\n",
    "featured": false,
    "publishedOn": "2026-05-06"
  },
  {
    "slug": "cad-to-bim-transition-guide",
    "category": "guides",
    "cover": "bim",
    "title": "Moving from CAD to BIM: a planning checklist for engineering offices",
    "excerpt": "BIM changes how a whole office works, not just the software it uses. This six-step checklist helps design firms move from 2D CAD to BIM without disrupting live projects.",
    "tags": [
      "BIM",
      "Autodesk",
      "Training"
    ],
    "products": [
      "autodesk",
      "bentley"
    ],
    "status": "published",
    "body": "Moving from 2D CAD to Building Information Modelling (BIM) is one of the biggest changes a design office can make. Done well, it improves coordination, cuts rework and gives clients better information. Done in a hurry, it can slow live projects and frustrate experienced staff. Planning is what separates the two outcomes.\n\n## BIM is a process, not a software upgrade\n\nInstalling Revit or another BIM tool doesn't make an office \"BIM-ready\". BIM changes how information is created, shared and checked across a project. It affects templates, standards, roles, reviews and deliverables. Treat the transition as a change-management project that happens to include software.\n\n## 1. Start with a pilot project\n\nChoose a real project that is small enough to manage but complex enough to test your workflow. A small team of motivated staff should run it in BIM from start to finish. The pilot will show where your templates, skills and hardware fall short before you commit the whole office.\n\n## 2. Set standards and templates first\n\nYour CAD standards took years to refine, and your BIM standards need the same care. Before modelling at scale, agree on:\n\n- Project templates, including families or content libraries, views, sheets and annotation styles.\n- Naming conventions for files, views and model elements.\n- Levels of detail at each project stage, and what each discipline is responsible for modelling.\n- How information will be exchanged and checked. ISO 19650, the international standard for managing information with BIM, is a useful framework to align with.\n\n## 3. Train by role, not by product\n\nAn architect, a structural engineer, a BIM coordinator and a project manager need different skills. Generic \"introduction to the software\" courses leave gaps. Plan training around the tasks each role actually performs, and follow up with support on real project work after the course.\n\n## 4. Check your hardware and infrastructure\n\nBIM models are much larger than 2D drawings. Review workstation specifications, graphics cards, storage and network performance before rollout. Slow machines are one of the fastest ways to lose goodwill during a transition.\n\n## 5. Plan for coordination and collaboration\n\nBIM delivers the most value when models from different disciplines come together. Decide how models will be federated and checked. Tools such as Navisworks support clash detection and construction coordination. Agree on a common data environment where everyone works from the current information.\n\n## 6. Measure, refine and scale\n\nAfter the pilot, review what worked. Compare coordination issues, drawing production time and rework with a similar CAD project. Update templates and training, then roll BIM out to more teams in stages rather than all at once.\n\n:::callout{icon=graduation title=\"CDSS CAD-to-BIM transition programme\"}\nOur certified trainers help teams move from CAD to BIM with role-based training, delivered in person in Lagos or online via Zoom and Microsoft Teams. [View training options](/training).\n:::\n",
    "featured": false,
    "publishedOn": "2026-06-24"
  },
  {
    "slug": "pipeline-integrity-software-upstream",
    "category": "insights",
    "cover": "pipeline",
    "title": "Pipeline integrity in upstream operations: where engineering software earns its keep",
    "excerpt": "When an inspection finds corrosion or a dent, operators need a quick, defensible answer: can the line keep operating safely? Here is how integrity software supports that decision.",
    "tags": [
      "Oil & Gas",
      "Technical Toolboxes",
      "Pipelines"
    ],
    "products": [
      "technical-toolboxes",
      "bentley",
      "ansys"
    ],
    "status": "published",
    "body": "Pipelines are among the most valuable assets an oil & gas operator owns, and among the hardest to inspect and maintain. When an inspection run finds wall loss, a dent or a crack-like feature, the engineering team has to answer quickly and defensibly: is the line fit to keep operating, and for how long?\n\n## Ageing assets, higher stakes\n\nMany pipelines run in harsh conditions, including humid coastal environments, swamp crossings, offshore risers and produced fluids that can be corrosive. Over time, wall loss and mechanical damage build up. A failure can cost far more than lost production, with safety, environmental and reputational consequences as well.\n\nThat is why integrity management has become a discipline in its own right. It depends on consistent, repeatable engineering calculations.\n\n## Fitness-for-service assessment\n\nFitness-for-service (FFS) assessment checks whether a pipeline with a known defect can keep operating at its current pressure, needs to be de-rated, or must be repaired. Engineers use recognised methods such as ASME B31G for corroded pipelines. They assess each defect using its measured dimensions, the pipe properties and the operating conditions.\n\nDoing this by hand or in unmanaged spreadsheets is slow and error-prone, especially when an inline inspection reports hundreds of features. Dedicated integrity software applies the methods consistently and documents every assumption.\n\n## Corrosion evaluation and remaining life\n\nA single inspection gives a snapshot. Comparing inspections over time shows the corrosion rate, and that makes it possible to estimate remaining life and plan the next inspection or repair before a defect becomes critical. Integrity software helps turn inspection data into a maintenance plan with clear priorities.\n\n## Standardised design calculations\n\nIntegrity starts at design. Wall thickness selection, pressure ratings and crossing designs all set the margins an operator will depend on for decades. Standard calculation tools help different engineers and contractors produce consistent results across a portfolio of projects.\n\n## Connecting integrity to design and analysis\n\nPipeline integrity work rarely happens on its own. Piping stress analysis in AutoPIPE, detailed finite element analysis in ANSYS and plant models in OpenPlant all feed into, or depend on, integrity decisions. When these tools come from one partner that also supports them, teams spend less time sorting out licensing and more time on the engineering.\n\n## Training the people behind the numbers\n\nSoftware is only as reliable as the engineer using it. Technical Toolboxes pairs its pipeline engineering software with industry-standard training, and CDSS delivers that training locally alongside ongoing technical support. That way, engineers understand the methods behind each result as well as the buttons.\n\n:::callout{icon=shield title=\"Pipeline engineering tools, supported locally\"}\nCDSS supplies and supports Technical Toolboxes' pipeline integrity, corrosion and design software for Nigeria's upstream and midstream sector. [Explore Technical Toolboxes](/products/technical-toolboxes).\n:::\n",
    "featured": false,
    "publishedOn": "2026-08-12"
  },
  {
    "slug": "simulation-before-construction",
    "category": "insights",
    "cover": "simulation",
    "title": "Simulate before you build: how engineering simulation reduces project risk",
    "excerpt": "Fixing a design problem on the computer costs far less than fixing it on site. Here is where engineering simulation fits alongside design tools, and how to get results you can trust.",
    "tags": [
      "ANSYS",
      "Simulation",
      "Engineering"
    ],
    "products": [
      "ansys",
      "bentley"
    ],
    "status": "published",
    "body": "Fixing a design problem costs the least before anything is built. Engineering simulation lets teams test how a component, structure or system will behave under real loads, temperatures and flows while changes are still cheap to make.\n\n## Why simulate?\n\nCode-based design methods are reliable for standard situations. But many engineering problems don't fit the standard cases: unusual geometry, combined loads, local stress concentrations, heat transfer or complex fluid behaviour. Simulation fills that gap. It shows where stresses concentrate, how heat moves through a component and how fluid flows, which a hand calculation can only approximate.\n\n- **Fewer surprises:** find weak points and failure modes before fabrication.\n- **Better designs:** compare options quickly and optimise for weight, cost or performance.\n- **Fewer physical prototypes:** use testing to confirm a design rather than to discover problems.\n- **Defensible decisions:** give clients, certifying bodies and insurers clear evidence of how the design will perform.\n\n## Structural, thermal, fluid, or all three\n\nANSYS covers the main physics engineering teams need. That includes structural mechanics and stress analysis, heat transfer and thermal simulation, and computational fluid dynamics (CFD). Many real problems involve more than one: a hot component expands and causes stress, and a flowing fluid loads a structure. Multiphysics simulation couples these effects so the model behaves like the real thing.\n\n## Where simulation fits alongside design tools\n\nSimulation adds to design tools; it doesn't replace them. A typical workflow uses:\n\n1. **Design and code checks** in tools such as STAAD.Pro for structures or AutoPIPE for piping systems.\n2. **Detailed simulation** in ANSYS for components, connections or conditions outside the standard code cases.\n3. **Design updates** fed back into the CAD or BIM model, so drawings and models stay consistent.\n\n## Getting results you can trust\n\nA colourful contour plot is not the same as a correct answer. Reliable simulation depends on good practice:\n\n- Represent supports, loads and contacts realistically. Boundary conditions cause more errors than anything else.\n- Check mesh quality, and refine the mesh until the results stop changing meaningfully.\n- Sense-check results against hand calculations or known solutions.\n- Use appropriate material data, and understand where linear assumptions stop being valid.\n- Document assumptions so that a reviewer can follow and repeat the analysis.\n\n## Building in-house capability\n\nSimulation delivers the most value when engineers use it regularly, not as a rare specialist exercise. That takes the right licences, structured training and someone to call when a model misbehaves. CDSS provides all three, and ANSYS sits within the same training and support model we use across our whole portfolio.\n\n:::callout{icon=cpu title=\"Explore engineering simulation\"}\nTalk to us about ANSYS licensing, training and support for your engineering team. [Explore ANSYS](/products/ansys).\n:::\n",
    "featured": false,
    "publishedOn": "2026-09-15"
  }
];
