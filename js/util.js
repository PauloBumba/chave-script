const $=s=>document.querySelector(s),norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase(),key=s=>norm(s).toLowerCase();
