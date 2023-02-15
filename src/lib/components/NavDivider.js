/**
 * @copyright Copyright (c) 2023, Leosac SAS - www.leosac.com
 *
 * @license GNU LGPL version 3
 **/
import { withTranslation } from "react-i18next";

function NavDivider () {
    return (
        <li className="nav-divider">&nbsp;</li>
    );
};

export default withTranslation()(NavDivider);