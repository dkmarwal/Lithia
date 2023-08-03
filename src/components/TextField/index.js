import React, { Component } from "react";
import { Box, Typography } from "@material-ui/core";

class TextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actualField: "",
      showDecryptedValue: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { value } = this.props;
  }

  handleChange(event) {
    const { prevValue, actualField } = this.state;
    const origValue = event.target.value || "";
    let actual = actualField;
    if (origValue < prevValue) {
      actual = "";
    }
  }

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
    } = this.props;
    

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
            value={value}
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

export default TextInput;
