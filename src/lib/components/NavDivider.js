import { withTranslation } from "react-i18next";

function NavDivider () {
    return (
        <li className="nav-divider">&nbsp;</li>
    );
};

export default withTranslation()(NavDivider);