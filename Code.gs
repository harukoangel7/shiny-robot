const SHEET_NAME = 'User Registration';
const ADMIN_KEY = 'CHANGE_THIS_ADMIN_KEY';
const HEADERS = [
  'Timestamp','Staff ID','Email','Phone Number','First Name','Last Name','Other Names','Date of Birth',
  'Marital Status','Education Level','Additional Profile Details','Authority Domain','Sub-district','Facility',
  'Cadre','Grade','Position','Unit','Specialty','Assigned Roles','Status','Approved At','Deactivated At','Updated At'
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  ensureHeaders_(sheet);
  return sheet;
}
function ensureHeaders_(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  const current = sheet.getRange(1,1,1,lastCol).getValues()[0];
  HEADERS.forEach((h,i)=>{ if (current[i] !== h) sheet.getRange(1,i+1).setValue(h); });
}
function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const sheet = getSheet_();
  if (data.action === 'register') return register_(sheet,data);
  if (!validAdmin_(data.adminKey)) return output_({status:'error',message:'Unauthorized'});
  if (data.action === 'approve') return updateStatus_(sheet,data.rowId,'APPROVED');
  if (data.action === 'deactivate') return updateStatus_(sheet,data.rowId,'INACTIVE');
  if (data.action === 'edit') return edit_(sheet,data);
  return output_({status:'error',message:'Unknown action'});
}
function doGet(e) {
  const action = (e.parameter && e.parameter.action) || 'health';
  if (action === 'health') return output_({status:'ok',message:'AAK District staff user service is running.'});
  if (action === 'users') {
    if (!validAdmin_(e.parameter.adminKey)) return jsonp_(e, {status:'error',message:'Unauthorized',users:[]});
    return jsonp_(e, {status:'success',users:listUsers_()});
  }
  return output_({status:'error',message:'Unknown action'});
}
function register_(sheet,d) {
  const row = [new Date(),d.staffId||'',d.email||'',d.phone||'',d.firstName||'',d.lastName||'',d.otherNames||'',d.dob||'',d.maritalStatus||'',d.education||'',d.profileDetails||'',d.authorityDomain||'',d.subDistrict||'',d.facility||'',d.cadre||'',d.grade||'',d.position||'',d.unit||'',d.specialty||'',d.roles||'','PENDING','','',new Date()];
  sheet.appendRow(row);
  return output_({status:'success',message:'Registration submitted'});
}
function listUsers_() {
  const sheet = getSheet_(), values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0], idx = {}; headers.forEach((h,i)=>idx[h]=i);
  return values.slice(1).map((r,n)=>({
    rowId:String(n+2), staffId:r[idx['Staff ID']]||'', email:r[idx['Email']]||'', phone:r[idx['Phone Number']]||'',
    firstName:r[idx['First Name']]||'', lastName:r[idx['Last Name']]||'', otherNames:r[idx['Other Names']]||'',
    authorityDomain:r[idx['Authority Domain']]||'', subDistrict:r[idx['Sub-district']]||'', facility:r[idx['Facility']]||'',
    cadre:r[idx['Cadre']]||'', grade:r[idx['Grade']]||'', position:r[idx['Position']]||'', unit:r[idx['Unit']]||'', specialty:r[idx['Specialty']]||'',
    roles:r[idx['Assigned Roles']]||'', status:r[idx['Status']]||'PENDING'
  }));
}
function updateStatus_(sheet,rowId,status) {
  const row = Number(rowId); if (!row || row < 2 || row > sheet.getLastRow()) return output_({status:'error',message:'Invalid row'});
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const statusCol = headers.indexOf('Status')+1, approvedCol=headers.indexOf('Approved At')+1, deactivatedCol=headers.indexOf('Deactivated At')+1, updatedCol=headers.indexOf('Updated At')+1;
  sheet.getRange(row,statusCol).setValue(status); if(status==='APPROVED') sheet.getRange(row,approvedCol).setValue(new Date()); if(status==='INACTIVE') sheet.getRange(row,deactivatedCol).setValue(new Date()); sheet.getRange(row,updatedCol).setValue(new Date());
  return output_({status:'success',message:'Status updated'});
}
function edit_(sheet,d) {
  const row=Number(d.rowId); if(!row || row<2 || row>sheet.getLastRow()) return output_({status:'error',message:'Invalid row'});
  const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0], map={}; headers.forEach((h,i)=>map[h]=i+1);
  const fields={'Staff ID':'staffId','Email':'email','Phone Number':'phone','First Name':'firstName','Last Name':'lastName','Other Names':'otherNames','Authority Domain':'authorityDomain','Sub-district':'subDistrict','Facility':'facility','Cadre':'cadre','Grade':'grade','Position':'position','Unit':'unit','Specialty':'specialty','Assigned Roles':'roles'};
  Object.keys(fields).forEach(h=>sheet.getRange(row,map[h]).setValue(d[fields[h]]||'')); sheet.getRange(row,map['Updated At']).setValue(new Date()); return output_({status:'success',message:'Updated'});
}
function validAdmin_(key){return key && key===ADMIN_KEY;}
function output_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
function jsonp_(e,obj){const cb=(e.parameter&&e.parameter.callback)||'callback';return ContentService.createTextOutput(cb+'('+JSON.stringify(obj)+')').setMimeType(ContentService.MimeType.JAVASCRIPT);}
