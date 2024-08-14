import { toast } from "sonner";
import { addTime } from "./addTime";

export const entityRoleEvaluate = async (entity, userId) => {
  if (entity.share) {
    if (JSON.parse(entity.share)) {
      const share = JSON.parse(entity.share);
      if (share.users) {
        const check = await share.users.find((u) => u.user === userId);
        if (check) {
          if (check.expiry) {
            if (addTime(check.expiry) >= addTime(Date.now())) {
              //   setLoader(false);
              //   entity.access = check.access;
              //   showEntity(type, entity);
              return check.access;
            } else {
              //   setLoader(false);
              //   toast.error(
              //     `Your permissions to access this entity has expired ${moment(
              //       check.expiry
              //     ).fromNow()}`
              //   );
            }
          } else if (check.events) {
            let event = check.events[0];
            if (event) {
              if (event.filter) {
                if (event.filter.condition == "equals") {
                  if (entity[event.filter.field] === event.filter.value) {
                    // setLoader(false);
                    // entity.access = check.access;
                    // showEntity(type, entity);
                    return check.access;
                  } else {
                    // setLoader(false);
                    // toast.error("You can't access this entity(1)");
                  }
                } else if (event.filter.condition == "contains") {
                  if (
                    entity[event.fields[0].value]
                      .toLowerCase()
                      .includes(event.filter.value.toLowerCase())
                  ) {
                    // setLoader(false);
                    // entity.access = check.access;
                    // showEntity(type, entity);
                  } else {
                    // setLoader(false);
                    // toast.error("You can't access this entity(2)");
                  }
                } else {
                  //   toast.error(entity[event.fields[0].value]);
                }
              }
            }
          } else {
            // setLoader(false);
            // entity.access = check.access;
            // showEntity(type, entity);
          }
        } else {
          //   setLoader(false);
          //   toast.error("You dont have permission to access this entity (1).");
        }
      } else {
        // setLoader(false);
        // toast.error("You dont have permission to access this entity (2).");
      }
    } else {
      //   setLoader(false);
      //   toast.error("You dont have permission to access this entity (3).");
    }
  } else {
    return "No role found";
  }
};
