import React, {Component} from 'react'
import { Link } from "react-router-dom";

class Modals extends Component {
    constructor(props) {
        super()
     }

    render() {
        const { img, alt, title, ...rest } = this.props
        return(
            <>
            <div style={{position:"fixed", zIndex:0, top:0, left:0, width:"100%", height:"100%", backgroundColor:"rgb(0 0 0 / 40%)"}}> </div>
             <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <Link to="/#" onClick={rest.closeBtn}>
                    <i className="icon-ic_close iconclose"></i>
                  </Link>
                  <div className="modal-title">{title}</div>
                </div>
                <div className="modal-body text-center">
                  <p className="mt-10">
                   {rest.text}
                  </p>
                  <img
                    src={img}
                    alt={alt}
                    className="img-responsive center-block mb-15"
                  />
                </div>
                <div className="modal-footer">
                  <div className="closelink">
                    <Link to="/#" onClick={rest.closeBtn}>
                    {rest.closeBtnText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
        </div>
            </>
       
        )
    }
}
export default Modals