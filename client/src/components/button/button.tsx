import "./button.scss";
import React from "react";

interface Props {
    onClick?: () => void;
    children?: HTMLElement | string
    type?: "primary" | "secondary" | "warn"
    active?: boolean
}

export default class Button extends React.Component {

    props: Props;

    constructor(props: Props) {
        super(props);
        this.props = props;
    }

    onEnter = async (event: React.KeyboardEvent<HTMLDivElement>): Promise<void> => {
        if (event.key === "Enter") {
            if (this.props.onClick) await this.props.onClick();
        }
    };

    render() {

        let className = "rounded-button ";
        if (this.props.type) className += this.props.type;

        return (
            <div onClick={this.props.onClick} onKeyPress={this.onEnter} className={className}>
                <button className={this.props.active ? "active" : ""}>
                    <span>{this.props.children}</span>
                </button>
            </div>

        );
    }
}

