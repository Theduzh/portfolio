import { Grid } from "@mui/material";
import QuickAccessBtn from "./QuickAccessBtn";
import bike from "../assets/bike.svg";
import promotions from "../assets/promotions.svg";
import medal from "../assets/medal.svg";
import question from "../assets/question.svg";

const quickAccessOptions = [
    {
        title: "Rent a bike",
        icon: bike,
        link: "/rent",
    },
    {
        // TODO: fill this! cant have 2 buttons pointing to the same thing
        title: "Promotion",
        icon: promotions,
        link: "/promotions",
    },
    {
        title: "Rewards",
        icon: medal,
        link: "/rewards",
    },
    {
        title: "Support",
        icon: question,
        link: "/help",
    },
];

function QuickAccessButtons() {
    return (
        <Grid container spacing={{ xs: 2, md: 4 }}>
            {quickAccessOptions.map((option) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={option.title}
                    sx={{ justifyContent: "start" }}
                >
                    <QuickAccessBtn
                        title={option.title}
                        icon={option.icon}
                        link={option.link}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default QuickAccessButtons;
