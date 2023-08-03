import React, { Component } from "react";
import { starredMask } from "~/utils/common";
import { Box, Typography } from "@material-ui/core";

class MaskInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actualField: "",
      maskedField: "",
      showDecryptedValue: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { value } = this.props;
    const prevValue = "";
    const newValue = "";
    let actual = value || "";
    this.mask(prevValue, newValue, actual);
  }

  handleChange(event) {
    const { maskedField, actualField } = this.state;
    const prevValue = maskedField;
    const origValue = event.target.value || "";
    const newValue = origValue.split(" ").join("");
    let actual = actualField;
    if (origValue < prevValue) {
      actual = "";
    }
    this.mask(prevValue, newValue, actual);
  }

  mask = (prevValue, newValue, actual) => {
    const { getvalue } = this.props;
    if (newValue.length > prevValue.length) {
      let newChar = newValue.split("").pop();
      if (!isNaN(newChar)) actual = `${actual}${newChar}`;
    }
    // backspacing / deleting
    else {
      //   const charsRemovedCount = prevValue.length - newValue.length;
      //   if (newValue.length === 1) {
      //     actual = newValue;
      //   } else {
      //     actual =
      //       (actual &&
      //         actual.toString().substr(0, actual.length - charsRemovedCount)) ||
      //       "";
      //   }
      actual = actual.toString();
    }
    this.setState({
      actualField: actual,
      maskedField: starredMask(actual),
    });
    getvalue(actual);
  };

  render() {
    const {
      disabled,
      maxLength,
      name,
      value,
      autoFocus,
      label,
      getvalue,
      errors,
      placeholder,
      ...restProps
    } = this.props;
    
    let masked = starredMask(value);
    return (
      <div>
        <Box className="form-group">
          <label>{label}</label>
          <input
            type="text"
            placeholder={placeholder}
            className={`form-control ${
              errors?.length > 0 && "errorfield"
            } `}
            value={this.state.showDecryptedValue ? value : masked}
            name={name}
            maxLength={maxLength}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyup}
            onPaste={(e) => {
              e.preventDefault();
              return false;
            }}
            onCopy={(e) => {
              e.preventDefault();
              return false;
            }}
            onCut={(e) => {
              e.preventDefault();
              return false;
            }}
            onDrag={(e) => {
              e.preventDefault();
              return false;
            }}
            onDrop={(e) => {
              e.preventDefault();
              return false;
            }}
            autoComplete="off"
          />

          {errors?.length > 0 && (
            <Typography className="errortxt">{errors}</Typography>
          )}
        </Box>
        
      </div>
    );
  }
}

export default MaskInput;
