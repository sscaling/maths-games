'use strict';

const _randBetween = (start, end) => parseInt(start + (Math.random() * (end - start)), 10);

function _shuffle(array) {
    var index = -1,
        size = array.length,
        lastIndex = length - 1,
        result = array.slice();

    while (++index < size) {
        var rand = _randBetween(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
    }
    result.length = size;
    return result;
}

function Square(props) {
    return (
        <div className={props.target == props.value ? "square target" : "square"}>{props.value}</div>
    );
}

class NumberSquare extends React.Component {

    render() {
        let _id = (i, j) => ((j + 1) + (i * dim));

        let board = [];

        let dim = parseInt(this.props.size, 10);
        for (let i = 0; i < dim; i++) {
            board.push(<div className="board-row" key={i}>{
                new Array(dim).fill(0).map((_, j) => (
                    <Square key={_id(i, j)} value={_id(i, j)} target={this.props.target} />
                ))
            }</div>)
        };

        return board;
    }
}


function useTraceUpdate(props) {
    const prev = React.useRef(props);
    React.useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log('Changed props:', changedProps);
        }
        prev.current = props;
    });
}

function Option(props) {
    useTraceUpdate(props);
    return (
        <div className="square" onClick={props.cb}>{props.value}</div>
    );
}

class Options extends React.Component {
    constructor(props) {
        super(props);

        let t = props.target;
        this.state = {
            targets: _shuffle([t, t - 1, t - 2, t + 1, t + 2]),
        }
        this.onSuccess = this.onSuccess.bind(this);
        this.onFail = this.onFail.bind(this);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     Object.entries(this.props).forEach(([key, val]) =>
    //         prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    //     );
    //     if (this.state) {
    //         Object.entries(this.state).forEach(([key, val]) =>
    //             prevState[key] !== val && console.log(`State '${key}' changed`)
    //         );
    //     }
    // }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.target != prevProps.target) {
            let t = this.props.target;
            this.setState({
                targets: _shuffle([t, t - 1, t - 2, t + 1, t + 2]),
            })
        }

    }

    onSuccess() {
        // window.alert("win");
        this.props.cb(true);
    }

    onFail() {
        // window.alert("fail");
        this.props.cb(false);
    }

    render() {
        const target = this.props.target;

        // given target generate some options

        let targets = this.state.targets.map((v) =>
            <Option key={v} value={v} cb={(target - 1) == v ? this.onSuccess : this.onFail} />
        );
        return (
            <div className="board-row">
                {targets}
            </div>
        )
    }
}

function Result(props) {
    // useTraceUpdate(props);
    return (
        <div>
            <div>Result ? {props.result}</div>
            <div>OK ? {props.ok}</div>
            <div>Wrong ? {props.wrong}</div>
        </div>
    )
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            result: false,
            target: _randBetween(0, Math.pow(props.size, 2)),
            ok: 0,
            wrong: 0,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     Object.entries(this.props).forEach(([key, val]) =>
    //         prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    //     );
    //     if (this.state) {
    //         Object.entries(this.state).forEach(([key, val]) =>
    //             prevState[key] !== val && console.log(`State '${key}' changed`)
    //         );
    //     }
    // }

    handleClick(v) {
        console.log(v);

        // let result = (this.state.target - 1) == v;
        // result ? window.alert('good') : window.alert('bad');
        let update = {
            result: v,
            target: v ? _randBetween(0, Math.pow(this.props.size, 2)) : this.state.target,
            ok: v ? this.state.ok + 1: this.state.ok,
            wrong: v ? this.state.wrong : this.state.wrong + 1,
        };
        this.setState(update);
    }

    // FIXME: pull shuffled items down into this method, then we can remove
    //       the class approach and just use function components. Because the
    //       shuffle happens in each render, it causes it to redraw (as far as I can tell)
    render() {
        return (
            <div>
                <div>one less than {this.state.target}</div>
                <Options target={this.state.target} cb={this.handleClick} />
                <Result result={this.state.result ? "yay" : "nay"} ok={this.state.ok} wrong={this.state.wrong} />
                <hr />
                <NumberSquare size={this.props.size} target={this.state.target} />
            </div>
        );
    }
}

const domContainer = document.getElementById("root")
// const domContainer = document.querySelector("#root");
ReactDOM.render(<Game size="10" />, domContainer);