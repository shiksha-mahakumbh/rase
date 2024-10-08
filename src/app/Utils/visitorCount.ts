


export function getVisitorCount(): number {
    const count = localStorage.getItem('visitorCount');
    console.log(count+ "get")
    return count ? parseInt(count, 10) : 73071;
  }
  
  export function incrementVisitorCount(): number {
    const count = getVisitorCount() + 1;
    console.log(count+ "inc")
    localStorage.setItem('visitorCount', count.toString());
    return count;
  }
  
  export function incrementCountOnPageLoad(): number {
    const count = incrementVisitorCount();
      const newLocal = "incLoad";
    console.log(count+ newLocal)
    return count;
  }
  
  