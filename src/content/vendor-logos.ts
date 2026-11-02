// Built-in vendor logos, by vendor name. A logo uploaded for a product in /admin takes priority over these.
const VENDOR_LOGOS: Record<string, string> = {
  Autodesk: '/brand/vendors/autodesk.png',
  'Bentley Systems': '/brand/vendors/bentley.png',
  'Bentley Systems Training': '/brand/vendors/bentley.png',
  Seequent: '/brand/vendors/seequent.png',
  Ansys: '/brand/vendors/ansys.png',
  'Technical Toolboxes': '/brand/vendors/technical-toolboxes.png',
  Contex: '/brand/vendors/contex.png',
  Avision: '/brand/vendors/avision.png',
  MasterSeries: '/brand/vendors/masterseries.png',
  CYPE: '/brand/vendors/cype.png',
  'Octave (formerly Hexagon PPM)': '/brand/vendors/octave.png',
  ClearEdge3D: '/brand/vendors/clearedge3d.png',
  VSee: '/brand/vendors/vsee.png',
};

export const vendorLogo = (name: string): string | undefined => VENDOR_LOGOS[name];

export const LOGO_FINE_PRINT = 'Each logo is a trademark of its owner.';
