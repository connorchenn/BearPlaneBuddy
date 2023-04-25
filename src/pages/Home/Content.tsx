import Button from './Button'
function Content() {
  return (
    <div>
        <div id="top">
            <input id="searchBox" type="text" placeholder="Search flight # | time | group number"></input>
            <Button text="add"></Button>
            <Button text="Logout"></Button>
        </div>
        <div id="bottom">
            <div id="board">
                <div id="display"></div>
            </div>
        </div>
    </div>
  );
}

export default Content;