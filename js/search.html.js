[['q', 'keydown'], ['searchBtn', 'click']].forEach(
    ev => document.getElementById(ev[0]).addEventListener(ev[1], e => {
        if (ev[1] === 'keydown') {
            if (e.isComposing || e.key != 'Enter') return;
        }
        const params = new URLSearchParams();
        const q = document.getElementById('q').value;
        if (q === '') return;
        const sort = document.getElementById('sort').value;
        params.append('q', q);
        params.append('sort', sort);
        params.append('page', '0');
        console.log(`./sresult?${params.toString()}`);
        location.assign(`./sresult?${params.toString()}`);
    })
);
