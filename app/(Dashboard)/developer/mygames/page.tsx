export default () => {
    // function navGo(s: string) {

    // }
    // const { myGames, removeGame } = useGlobal();


    // const { navigateTo } = useApp()
    // const { setDraftGame } = useGlobal();
    // // const { showToast } = useToast();
    // function editGame(id: string) {
    //     console.log(myGames);
    //     const s = setDraftGame(id);
    //     if (s) {
    //         navigateTo('dev-edit-game')

    //     } else {
    //         showToast("Can't find the game in your list", 'error');
    //     }
    // }

    return <div className="section" id="sec-mygames">
        <div className="page-title">My Games</div>
        <div className="page-sub">Track the status of your submitted and published games.</div>
        <div className="games-grid" id="myGamesGrid">

            {
                // myGames.length > 0 &&
                // myGames.map(g =>
                //     <div key={g.id} className="game-tile">
                //         <div className="game-tile-thumb">
                //             <img src={getCover169URl(g.covers)} width="100%" height="100%" />
                //             <span className="status-pip">
                //                 {/* <span className={STATUS_BADGES[g.status].classname}>{STATUS_BADGES[g.status].label}</span> */}
                //             </span>
                //         </div>
                //         <div className="game-tile-body">
                //             <div className="game-tile-title">{g.name}</div>
                //             <div className="game-tile-cat">{g.category}</div>
                //             <div className="game-tile-stats">
                //                 {/* <span>👁 ${g.plays.toLocaleString()} plays</span> */}
                //             </div>
                //             {/* ${feedbackHtml} */}
                //             <div className="game-tile-actions">
                //                 <button className="btn btn-ghost" style={{ flex: 1, padding: 7, fontSize: 12 }}
                //                     onClick={() => editGame(g.id)}>✏ Edit</button>
                //                 <button className="btn btn-danger" style={{ flex: 1 }}
                //                     onClick={() => removeGame(g.id)}>🗑</button>
                //             </div>
                //         </div>
                //     </div>
                // )


            }

        </div>
        {
            // myGames.length == 0 && <div className="empty-state" id="myGamesEmpty" style={{ display: 'none' }}>
            //     <div className="eicon">🎮</div>
            //     <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>No games yet</div>
            //     <p>Submit your first game to get started.</p>
            //     <button className="btn btn-primary" style={{ width: 'auto', marginTop: '16px', padding: '12px 28px' }}
            //         onClick={() => navGo('submit')}>Submit a Game →</button>
            // </div>
        }
    </div>
}