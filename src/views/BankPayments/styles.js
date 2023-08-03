export const styles = (theme) => ({
    backdrop: { 
      zIndex: theme.zIndex.drawer + 5, 
      color: '#fff', 
      backgroundColor: '#fff' 
    },
    dialogTitleRoot: {
      padding: '0px 16px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    dialogTitleAction: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dialogTitleAccountList: {
      padding: '16px 16px',
      paddingLeft: '25px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dialogContentRoot: {
      padding: '0px 24px',
      overflowY:'hidden',
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    },
    dialogContentAccountList: {
      border: '1px solid #000',
      padding: '8px 16px',
      margin: '8px',
    },
    dialogMX: {
      '& .MuiDialog-paper': {
        minHeight: 300,
      },
    },
    dialogActionsButton: {
      justifyContent: 'center',
      marginBottom: theme.spacing(2),
      overflowY:'hidden'
    },
    circularProgressClass: {
      width: '100% !important',
      display: 'inline-flex',
      justifyContent: 'center',
    },
  });