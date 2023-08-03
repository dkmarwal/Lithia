import React, {Component} from 'react'
import { Box, Typography, Link } from "@material-ui/core";
class NotificationModals extends Component {
    constructor(props) {
        super()
     }

    render() {
        const { title, text, closeBtnText, ...rest } = this.props;
        
        return(
            <>
            <Box style={{position:"fixed", zIndex:0, top:0, left:0, width:"100%", height:"100%", backgroundColor:"rgb(0 0 0 / 40%)"}}> </Box>
             <Box className="modal fade">
            <Box className="modal-dialog">
              <Box className="modal-content">
                <Box className="modal-header">
                  <Link to="/#" onClick={rest.closeBtn}>
                    <i className="icon-ic_close iconclose"></i>
                  </Link>
                  <Box className="modal-title">{title}</Box>
                </Box>
                <Box px="40px" py="60px">
                  
                  <Typography>{text}</Typography>

                  {/* <ul> 
                  {Object.keys(text).length && Object.keys(text).map((item,i) =>{
                    return <li key={`id-${i}`}>{text[item]}</li>
                  })}
                  </ul> */}
                 </Box>
                 <Box className="modal-footer">
                 <button onClick={rest.closeBtn} 
                 className="btn-primary mt-20 col-auto mb-5">
                           {closeBtnText}
                </button>
                </Box>
              </Box>
            </Box>
        </Box>
            </>
       
        )
    }
}
export default NotificationModals