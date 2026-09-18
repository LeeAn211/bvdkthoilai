/**
 * Test updating patient-portal-settings via HTTP API (simulating Admin UI)
 * to reproduce the "Field sau không hợp lệ: id" error
 */
import { readFileSync } from 'fs';

// First, GET the current state
const base = 'http://localhost:3000';

async function testUpdate() {
  // 1. Get current data
  console.log('1. Fetching current patient-portal-settings...');
  const getRes = await fetch(`${base}/api/globals/patient-portal-settings?locale=undefined&fallback-locale=null&depth=1`);
  if (!getRes.ok) {
    console.error('GET failed:', getRes.status, await getRes.text());
    return;
  }
  const current = await getRes.json();
  console.log('Got data. subNavTabs count:', current.subNavTabs?.length);
  console.log('First tab:', current.subNavTabs?.[0]);
  
  // 2. Try updating with enabled=false on first tab (simulating what Admin UI does)
  if (!current.subNavTabs?.length) {
    console.log('No tabs found!');
    return;
  }
  
  const updatedTabs = current.subNavTabs.map((tab, i) => 
    i === 2 ? { ...tab, enabled: false } : tab
  );
  
  console.log('\n2. Attempting update with enabled=false on tab index 2...');
  console.log('Tab being modified:', JSON.stringify(updatedTabs[2], null, 2));
  
  const postRes = await fetch(`${base}/api/globals/patient-portal-settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subNavTabs: updatedTabs })
  });
  
  const postData = await postRes.json();
  console.log('POST status:', postRes.status);
  console.log('POST response:', JSON.stringify(postData, null, 2));
}

testUpdate().catch(console.error);
