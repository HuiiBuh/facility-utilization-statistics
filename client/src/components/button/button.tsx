import "./button.scss";
import React from "react";

interface Props {
    onClick?: () => void;
    children?: HTMLElement | string
    type?: "primary" | "secondary" | "warn"
    isActive?: boolean
    isSmall?: boolean
    class?: string
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
        else className += "primary";

        if (this.props.isSmall) className += " small";
        if (this.props.class) className += ` ${this.props.class}`;

        return (
            <span onClick={this.props.onClick} onKeyPress={this.onEnter} className={className}>
                <button className={this.props.isActive ? "active" : ""}>
                    <span>{this.props.children}</span>
                </button>
            </span>

        );
    }
}

