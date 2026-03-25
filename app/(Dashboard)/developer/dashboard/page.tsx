export default () => {
    return <div className="section" id="sec-dashboard">
        <div className="page-title">Developer Dashboard</div>
        <div className="page-sub" id="dashWelcome">Welcome back!</div>
        <div className="stats-row" id="devStatsRow">
            <div className="stat-card">
                <div className="stat-label">Total Plays</div>
                <div className="stat-val" id="dsTotalPlays">0</div>
                <div className="stat-chg up">↑ 12% this month</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Published Games</div>
                <div className="stat-val" id="dsPublished">0</div>
                <div className="stat-chg" id="dsPending" style={{ color: 'var(--muted)' }}>0 pending review</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Revenue (MTD)</div>
                <div className="stat-val" id="dsRevenue">$0</div>
                <div className="stat-chg up">↑ 8%</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Avg Rating</div>
                <div className="stat-val" id="dsRating">—</div>
                <div className="stat-chg up">↑ 0.2</div>
            </div>
        </div>
        <div className="chart-card">
            <div className="chart-title">📈 Weekly Plays (last 7 days)</div>
            <div className="bar-chart" id="devChart"></div>
            <div className="chart-xlabels" id="devChartLabels"></div>
        </div>
        <div className="page-title" style={{ fontSize: '16px', marginBottom: '14px' }}>Recent Submissions</div>
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Category</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Plays</th>
                    </tr>
                </thead>
                <tbody id="devDashTable"></tbody>
            </table>
        </div>
    </div>
}