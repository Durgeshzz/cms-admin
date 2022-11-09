export const getMessage = (type, message, close) => {
    if(type == "success"){
        return (
            <div className="alert alert-success fade in alert-dismissable clearfix">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-hidden="true"
                onClick={()=>{
                    close()
                }}
              >
                ×
              </button>
              <div className="alert-icon">
                <i className="fa fa-check" aria-hidden="true" />
              </div>
              <span className="alert-text">{message}</span>
            </div>
          );
    }
    else if(type == "fail"){
        return (
            <div className="alert alert-danger fade in alert-dismissable clearfix">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-hidden="true"
                onClick={()=>{
                    close()
                }}
              >
                ×
              </button>
              <div className="alert-icon">
                <i className="fa fa-exclamation" aria-hidden="true" />
              </div>
              <span className="alert-text">{message}</span>
            </div>
          );
    }
    else{
        return ("");
    }
}
