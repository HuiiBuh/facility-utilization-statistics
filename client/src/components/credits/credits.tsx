import React from "react";

function Credits() {
    return <div className="padding-left-right">
        <h1 className="text-center">Credits</h1>


        <h2 className="no-margin-bottom">Client:</h2>
        <ul className="no-margin-top">

            <li><a href="https://www.flaticon.com/authors/photo3idea-studio">photo3idea_studio </a>
                for the navigation bar image
            </li>


            <li>
                <a href="https://www.chartjs.org/   ">Chart.js</a> for the Chart implementation
            </li>

            <li>
                jerairrest for his <a href="https://github.com/jerairrest/react-chartjs-2">React Chart.js</a> wrapper
            </li>

            <li>
                ReactTraining for their <a
                href="https://github.com/ReactTraining/react-router#readme">Router</a> implementation
            </li>
            <li>
                inspect-js for their <a
                href="https://github.com/inspect-js/node-deep-equal">deepe-qual</a> library
            </li>

        </ul>

        <h2 className="no-margin-bottom">Server:</h2>
        <ul className="no-margin-top">
            <li>tv4 for the <a href="https://github.com/geraintluff/tv4"> json schema validation</a></li>
            <li>YousefED for the <a href="https://github.com/YousefED/typescript-json-schema"> json schema creation</a>
            </li>
        </ul>

        <ul>
            Visit my <a href="https://github.com/HuiiBuh/climbing-statistics">Github</a> page to take a look at the
            source code
        </ul>

    </div>;
}

export default Credits;